// Shared path resolution for tests. The binaries themselves are materialised
// by __tests__/setup/ensure-binaries.js (jest globalSetup).
const path = require('path')

const TESTBIN = path.resolve(__dirname, '../../.testbin')
const WABT_VERSION = process.env.WABT_VERSION || '1.0.37'
const WABT_BIN = path.join(TESTBIN, `wabt-${WABT_VERSION}`, 'bin')
const fixturesDir = path.resolve(__dirname, '../fixtures')

module.exports = {
  TESTBIN,
  WABT_VERSION,
  WABT_BIN,
  fixturesDir,
  trivialWat: path.join(fixturesDir, 'trivial.wat'),
  // generated from trivial.wat by the global setup
  trivialWasm: path.join(TESTBIN, 'trivial.wasm'),
  // first 20 bytes of trivial.wasm - reproduces the malformed-wasm failures
  // seen in production logs (wabt exits non-zero, e.g.
  // "invalid section size: extends past end")
  truncatedWasm: path.join(TESTBIN, 'truncated.wasm'),
  stellarStub: path.join(TESTBIN, 'bin', 'stellar'),
  stellarFailStub: path.join(TESTBIN, 'bin', 'stellar-fail'),
  // Live getter: setup-env.js requires this module before it sets
  // UPLOAD_DIR, so the value must be read at access time, not load time.
  get uploadDir() {
    return process.env.UPLOAD_DIR
  },
}
