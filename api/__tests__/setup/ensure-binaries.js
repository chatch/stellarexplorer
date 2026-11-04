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
const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')

const {
  TESTBIN,
  WABT_VERSION,
  trivialWat,
  trivialWasm,
  truncatedWasm,
  MINIJAIL_SRC,
  MINIJAIL0,
  LANDLOCK_PROBE,
} = require('../helpers/paths')

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

// Build the minijail sandbox launcher (see api/sandbox/run-minijail.sh).
// Clones google/minijail at the same pinned commit the Dockerfile uses (the
// linux-v9 tag predates a fix for newer kernel headers). Needs libcap-dev to
// build; skipped (with a warning, tests then run tools unsandboxed) when
// git/libcap-dev/make aren't available.
const MINIJAIL_COMMIT = '8787d1a4fdd7c64791607a1122d2408b3b35ade4'

function haveLibcapDev() {
  return fs.existsSync('/usr/include/sys/capability.h')
}

function ensureMinijail() {
  if (fs.existsSync(MINIJAIL0)) return
  if (!haveLibcapDev()) {
    // CI runners (and some dev machines) lack libcap-dev; try to install it.
    try {
      execFileSync('sudo', ['-n', 'apt-get', 'install', '-y', 'libcap-dev'], {
        stdio: 'ignore',
      })
    } catch {
      try {
        execFileSync('apt-get', ['install', '-y', 'libcap-dev'], {
          stdio: 'ignore',
        })
      } catch {}
    }
  }
  if (!haveLibcapDev()) {
    console.log(
      '[test setup] libcap-dev unavailable; wabt tools will run UNSANDBOXED in tests',
    )
    return
  }
  console.log(
    `\n[test setup] building minijail (${MINIJAIL_COMMIT.slice(0, 7)})...`,
  )
  fs.rmSync(MINIJAIL_SRC, { recursive: true, force: true })
  execFileSync('git', ['init', MINIJAIL_SRC], { stdio: 'ignore' })
  execFileSync(
    'git',
    [
      '-C',
      MINIJAIL_SRC,
      'remote',
      'add',
      'origin',
      'https://github.com/google/minijail',
    ],
    { stdio: 'ignore' },
  )
  execFileSync(
    'git',
    ['-C', MINIJAIL_SRC, 'fetch', '--depth', '1', 'origin', MINIJAIL_COMMIT],
    { stdio: 'inherit' },
  )
  execFileSync('git', ['-C', MINIJAIL_SRC, 'checkout', 'FETCH_HEAD'], {
    stdio: 'ignore',
  })
  // NB: must run make with cwd INSIDE the source dir — minijail's Makefile
  // sets its output dir from the process cwd, so `make -C` scatters object
  // files into the caller's directory.
  execFileSync('make', ['-j', String(os.cpus().length), 'all'], {
    cwd: MINIJAIL_SRC,
    stdio: 'inherit',
  })
}

// Build the small Landlock probe the API runs at startup (same source the
// Dockerfile compiles). Best-effort: the API skips the probe when absent.
function ensureLandlockProbe() {
  if (fs.existsSync(LANDLOCK_PROBE)) return
  const src = path.resolve(__dirname, '../../sandbox/landlock-probe.c')
  try {
    execFileSync('cc', ['-O2', '-o', LANDLOCK_PROBE, src], { stdio: 'inherit' })
  } catch {
    console.log('[test setup] cc unavailable; skipping landlock probe')
  }
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
  ensureMinijail()
  ensureLandlockProbe()
  writeStellarStubs()
  generateWasmFixtures()
}
