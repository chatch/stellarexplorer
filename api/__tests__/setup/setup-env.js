// Runs before every test file. Points the API's env-overridable tool paths
// at the binaries materialised by ensure-binaries.js, and gives each worker
// its own clean upload directory.
const fs = require('fs')
const path = require('path')

const { TESTBIN, WABT_BIN, stellarStub } = require('../helpers/paths')

process.env.NODE_ENV = 'test'
process.env.WABT_BIN_PATH = WABT_BIN
process.env.WASM_DECOMPILE_PATH = path.join(WABT_BIN, 'wasm-decompile')
process.env.WASM2WAT_PATH = path.join(WABT_BIN, 'wasm2wat')
process.env.STELLAR_BIN_PATH = stellarStub

const workerId = process.env.JEST_WORKER_ID || '0'
const uploadDir = path.join(TESTBIN, `test-uploads-${workerId}`)
fs.rmSync(uploadDir, { recursive: true, force: true })
fs.mkdirSync(uploadDir, { recursive: true })
process.env.UPLOAD_DIR = uploadDir
