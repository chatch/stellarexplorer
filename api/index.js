const Sentry = require('@sentry/node')

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // We don't ship performance traces from this simple API; errors only.
  tracesSampleRate: 0,
  // Tag every event so backend issues are searchable next to web-app issues.
  environment: process.env.NODE_ENV || 'production',
  release: require('./package.json').version,
})

const express = require('express')
const { rateLimit } = require('express-rate-limit')
const multer = require('multer')
const morgan = require('morgan')
const { execFile, execFileSync } = require('child_process')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

// Current maximum - see discussions in Discord
const MAX_FILE_SIZE_BYTES =
  Number(process.env.MAX_FILE_SIZE_BYTES) || 200 * 1024 * 1024

// Native tooling. Overridable via env for local dev and tests; in production
// these live in the container image (see Dockerfile).
const WABT_VERSION = '1.0.37'
const WABT_BIN_PATH = process.env.WABT_BIN_PATH || `/wabt-${WABT_VERSION}/bin`
const WASM_DECOMPILE_PATH =
  process.env.WASM_DECOMPILE_PATH || `${WABT_BIN_PATH}/wasm-decompile`
const WASM_2_WAT_PATH = process.env.WASM2WAT_PATH || `${WABT_BIN_PATH}/wasm2wat`
const STELLAR_BIN_PATH = process.env.STELLAR_BIN_PATH || 'stellar'

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads')
const uploadedWasmPaths = new WeakMap()

fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, callback) => {
      const filename = `${crypto.randomUUID()}.wasm`
      uploadedWasmPaths.set(req, path.join(UPLOAD_DIR, filename))
      callback(null, filename)
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
})

const createLimiter = () =>
  rateLimit({
    windowMs: 60 * 1000,
    // Allow a higher burst under test so the suite isn't throttled.
    limit: process.env.NODE_ENV === 'test' ? 1000 : 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })

const limiter = createLimiter()
const decompileLimiter = createLimiter()

const handleCliFailure = (error, res, wasmFilePath) => {
  console.error(`exec error: ${error}`)
  Sentry.captureException(error)
  fs.rmSync(wasmFilePath, { force: true })
  return res.status(500).send('internal server error')
}

const getUploadedWasmPath = (req) => {
  const wasmFilePath = uploadedWasmPaths.get(req)
  if (!wasmFilePath) {
    const err = new Error('Missing uploaded wasm path')
    Sentry.captureException(err)
    throw err
  }

  return wasmFilePath
}

const wabtToolRoute = (subpath, toolPath) =>
  app.post(subpath, decompileLimiter, upload.single('contract'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file was uploaded.')
    }
    let wasmFilePath
    try {
      wasmFilePath = getUploadedWasmPath(req)
    } catch (error) {
      return res.status(500).send('internal server error')
    }

    execFile(toolPath, [wasmFilePath], (error, stdout) => {
      fs.rmSync(wasmFilePath, { force: true })
      if (error) {
        console.error(`exec error: ${error}`)
        Sentry.captureException(error)
        return res.status(500).send(`Command execution error: ${error}`)
      }
      res.contentType('text/plain')
      res.send(stdout)
    })
  })

const app = express()

const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      origin.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/) ||
      origin.match(/^https?:\/\/([a-z0-9-]+\.)*steexp\.com$/)
    ) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}
app.use(cors(corsOptions))

app.set('trust proxy', 2)

// One-line access log per finished request. Goes to stdout (Fly captures it
// into `fly logs`). Skips /health so any future Fly health probe doesn't
// drown the log. Includes request + response Content-Length so a single
// grep shows both the upload size and the response size.
app.use(morgan((tokens, req, res) => {
  const reqLen = req.headers['content-length'] || '-'
  const resLen = res.getHeader('content-length') || '-'
  return [
    new Date().toISOString(),
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    `${resLen}/${reqLen}`,
    '-',
    `${tokens['response-time'](req, res)} ms`,
    `"${tokens['user-agent'](req, res) || '-'}"`,
    `"${tokens.referrer(req, res) || '-'}"`,
  ].join(' ')
}, { skip: (req) => req.path === '/health' }))

/**
 * Decompile a wasm file using the wabt wasm-decompile tool
 *
 * To invoke from cli:
 *   curl -F "contract=@/wasm/contract.wasm" http://localhost:3000/decompile
 */
wabtToolRoute('/decompile', WASM_DECOMPILE_PATH)

/**
 * Convert wasm to wat using the wabt wasm2wat tool
 *
 * To invoke from cli:
 *   curl -F "contract=@/wasm/contract.wasm" http://localhost:3000/wat
 */
wabtToolRoute('/wat', WASM_2_WAT_PATH)

/**
 * Generate JSON and Rust interfaces from wasm using Stellar CLI.
 *
 * To invoke from cli:
 *   curl -F "contract=@/wasm/contract.wasm" http://localhost:3000/interface
 */
app.post('/interface', limiter, upload.single('contract'), (req, res) => {
  console.log('/interface')
  if (!req.file) {
    return res.status(400).send('No file was uploaded.')
  }
  let wasmFilePath
  try {
    wasmFilePath = getUploadedWasmPath(req)
  } catch (error) {
    return res.status(500).send('internal server error')
  }

  let rustInterface
  try {
    rustInterface = execFileSync(STELLAR_BIN_PATH, [
      'contract',
      'bindings',
      'rust',
      '--wasm',
      wasmFilePath,
    ]).toString()
  } catch (error) {
    return handleCliFailure(error, res, wasmFilePath)
  }

  fs.rmSync(wasmFilePath, { force: true })

  res.contentType('application/json')
  res.json({ rustInterface })
})

// Let Sentry capture uncaught request errors before our response formatter.
Sentry.setupExpressErrorHandler(app)

// Centralised error handler. Keeps multer failures (e.g. file too large) and
// CORS rejections from leaking stack traces or crashing the process.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).send('File too large')
    }
    console.error(`multer error: ${err.message}`)
    Sentry.captureException(err)
    return res.status(400).send(`Upload error: ${err.message}`)
  }
  console.error(`unhandled error: ${err}`)
  Sentry.captureException(err)
  return res.status(500).send('internal server error')
})

const port = Number(process.env.PORT) || 3001
// Only bind when run directly, so the app can also be imported for tests.
if (require.main === module) {
  app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
  })
}

module.exports = app
