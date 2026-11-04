// Shared path resolution for tests. The binaries themselves are materialised
// by __tests__/setup/ensure-binaries.js (jest globalSetup).
const path = require('path')

const TESTBIN = path.resolve(__dirname, '../../.testbin')
const WABT_VERSION = process.env.WABT_VERSION || '1.0.37'
const WABT_BIN = path.join(TESTBIN, `wabt-${WABT_VERSION}`, 'bin')
// minijail source + binaries are materialised by ensure-binaries.js under
// .testbin/minijail-src; the sandbox wrapper resolves them via env.
const MINIJAIL_SRC = path.join(TESTBIN, 'minijail-src')
const MINIJAIL0 = path.join(MINIJAIL_SRC, 'minijail0')
const MINIJAIL_PRELOAD = path.join(MINIJAIL_SRC, 'libminijailpreload.so')
const SANDBOX_BIN = path.resolve(__dirname, '../../sandbox/run-minijail.sh')
const LANDLOCK_PROBE = path.join(TESTBIN, 'landlock-probe')
const fixturesDir = path.resolve(__dirname, '../fixtures')

module.exports = {
  TESTBIN,
  WABT_VERSION,
  WABT_BIN,
  MINIJAIL_SRC,
  MINIJAIL0,
  MINIJAIL_PRELOAD,
  SANDBOX_BIN,
  LANDLOCK_PROBE,
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
