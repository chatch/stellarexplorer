// jest globalSetup: make the native tooling the API shells out to available
// for tests, without needing rust/cargo or a global install.
//
//  - wabt (wasm-decompile / wasm2wat): downloaded as a prebuilt ubuntu tarball
//    (same release the Dockerfile pins) and cached under .testbin/.
//  - stellar CLI: replaced with tiny shell stubs so the /interface route can
//    be exercised in both success and failure modes without rust. We use two
//    separate binaries rather than an env-var mode switch because jest runs
//    tests in a VM context whose process.env writes don't reliably reach
//    child_process's inherited environment.
//  - trivial.wasm / truncated.wasm: generated from the committed .wat fixture.
//
// Requires `curl` and `tar` on the host (present on Linux/macOS dev machines
// and on the ubuntu CI image).
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const { TESTBIN, WABT_VERSION, trivialWat, trivialWasm, truncatedWasm } =
  require('../helpers/paths')

const WABT_BIN = path.join(TESTBIN, `wabt-${WABT_VERSION}`, 'bin')
const WABT_MARKER = path.join(WABT_BIN, 'wasm2wat')

function ensureWabt() {
  if (fs.existsSync(WABT_MARKER)) return
  fs.mkdirSync(TESTBIN, { recursive: true })
  const asset = `wabt-${WABT_VERSION}-ubuntu-20.04.tar.gz`
  const url = `https://github.com/WebAssembly/wabt/releases/download/${WABT_VERSION}/${asset}`
  console.log(`\n[test setup] downloading wabt ${WABT_VERSION}...`)
  execFileSync('curl', ['-sL', '--fail', '-o', asset, url], {
    cwd: TESTBIN,
    stdio: 'inherit',
  })
  execFileSync('tar', ['xzf', asset], { cwd: TESTBIN, stdio: 'inherit' })
}

function writeStellarStubs() {
  const stubDir = path.join(TESTBIN, 'bin')
  fs.mkdirSync(stubDir, { recursive: true })

  // argv: 1=contract 2=bindings 3=rust 4=--wasm 5=<path>
  const stubs = {
    // success: emit rust bindings, exit 0
    stellar: `#!/bin/sh
# Test stub: stellar contract bindings rust --wasm <path> (success)
printf '// stub rust bindings for %s\\n' "$5"
exit 0
`,
    // failure: reproduce the prod error, exit 1
    'stellar-fail': `#!/bin/sh
# Test stub: stellar contract bindings rust --wasm <path> (failure)
printf '%s\\n' "error: generate rust from file: getting contract spec: reading wasm" >&2
exit 1
`,
  }

  for (const [name, content] of Object.entries(stubs)) {
    const stubPath = path.join(stubDir, name)
    fs.writeFileSync(stubPath, content, { mode: 0o755 })
    fs.chmodSync(stubPath, 0o755)
  }
}

function generateWasmFixtures() {
  execFileSync(path.join(WABT_BIN, 'wat2wasm'), [trivialWat, '-o', trivialWasm])
  fs.writeFileSync(truncatedWasm, fs.readFileSync(trivialWasm).subarray(0, 20))
}

module.exports = async function globalSetup() {
  ensureWabt()
  writeStellarStubs()
  generateWasmFixtures()
}
