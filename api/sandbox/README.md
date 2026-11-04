# wabt sandbox

Sandboxing for wabt tool runs (`wasm-decompile`, `wasm2wat`) on untrusted
.wasm uploads, via **Google's minijail0** (the ChromeOS/Android sandbox
launcher — battle-tested, no custom security code).

## Why

The wabt tools have open memory-corruption bugs reachable from hostile wasm
input (WebAssembly/wabt #2678, #2679, #2749, #2565) and the API shells out
to prebuilt binaries in the same container as the Node server. Every tool
run goes through `run-minijail.sh`, which applies:

1. **rlimits** — `RLIMIT_AS` 512 MB, `RLIMIT_CPU` 30 s, `RLIMIT_FSIZE`
   256 MB, `RLIMIT_NOFILE` 64, `RLIMIT_CORE` 0. Bounds the known
   DoS/assertion bugs (#2316, #2317, #2322).
2. **uid/gid drop to `nobody`** (65534) when running as root (the container
   does).
3. **Landlock filesystem rules** — read+execute on the tool dir and loader
   libs, read-only on `/usr` `/etc` `/dev` and the input file, no write
   access anywhere (`--landlock-abi 5` also mediates Truncate/IoctlDev).
   **Not available on Fly today** — see the limitation section below.
4. **seccomp allowlist** (`wabt.seccomp.policy`) — only the syscalls the
   tools actually make (derived with strace on 1.0.37, plus harmless glibc
   startup calls). Default deny = SIGSYS. No socket, clone, ptrace, bpf,
   io_uring, execve (blocks re-exec), etc. Installed post-exec via
   minijail's LD_PRELOAD hook.

## Files

- `run-minijail.sh` — the wrapper minijail0 is invoked through
- `wabt.seccomp.policy` — the syscall allowlist
- `landlock-probe.c` — startup probe reporting whether the kernel supports
  Landlock (compiled in the Dockerfile and by the test setup; the API runs
  it once at boot and logs the result)

The minijail source is built from a pinned upstream commit in the
Dockerfile (the `linux-v9` release tag predates a fix for newer kernel
headers, so we pin master @ `8787d1a4fdd7c64791607a1122d2408b3b35ade4`).
Binaries land in `/usr/local/bin/minijail0` and
`/usr/local/lib/libminijailpreload.so`; needs `libcap2` at runtime.
Tests build the same commit into `.testbin/` (skipped when `libcap-dev` is
unavailable — the suite then runs the tools unsandboxed).

## Known limitation: Landlock on Fly

**Fly's guest kernel (6.12.114-fly as of 2026-10) does not support
Landlock** — `landlock_create_ruleset` returns `ENOSYS`. minijail fails
open silently on this (documented behavior), so on Fly the effective layers
are **seccomp + uid drop + rlimits only**. That still means: no network, no
re-exec, no privileged syscalls, runs as `nobody`, bounded memory/CPU. The
missing piece is fs confinement beyond normal file permissions (e.g. a
compromised tool could read any world-readable file and write /tmp).

### This is a kernel issue, not a base-image issue

Landlock is a kernel LSM. The container base image (ubuntu, alpine, ...)
only provides userspace; every container on a Machine shares the **guest
kernel of Fly's Firecracker microVM** (`6.12.114-fly`). If that kernel is
built without `CONFIG_SECURITY_LANDLOCK` (or omits `landlock` from its
`CONFIG_LSM=` list), no base-image change can enable it. Confirmed by
comparison: the same ubuntu 26.04 image enforces Landlock fine on a
host kernel that has it, and returns `ENOSYS` on Fly's kernel.

So switching base images is **not** the fix. The options are:

1. Accept it (seccomp + uid drop + rlimits still apply), or
2. Chroot into a minimal rootfs via minijail's `-C`
   (`CAP_SYS_CHROOT` is in Fly's default capability set), which recovers
   most of the fs confinement without kernel support, or
3. Wait for Fly to ship a Landlock-enabled kernel — the rules then activate
   automatically with no code changes.

### Observability

The API logs the sandbox's real enforcement level once at startup
(`logSandboxStatus` in `index.js`), using the `landlock-probe` binary:

    [sandbox] landlock 8 - full filesystem confinement active
    [sandbox] WARNING: landlock unavailable (unsupported errno=38) - running
      with seccomp + uid drop + rlimits only; tool sandbox has NO filesystem
      confinement
    [sandbox] WABT_SANDBOX_BIN not set - wabt tools run UNSANDBOXED

Check `fly logs` for the first line after a deploy to see which mode is
active. A future kernel upgrade that gains Landlock will flip that line to
the first form automatically — no action needed.

## Local negative-test battery (launcher-agnostic acceptance criteria)

With `MINIJAIL0`/`MINIJAIL_PRELOAD` pointing at the binaries:

    SB=api/sandbox/run-minijail.sh; B=.testbin/wabt-1.0.37/bin
    $SB $B/wasm-decompile trivial.wasm        # correct output
    $SB /tmp/dynwr trivial.wasm               # write: EACCES
    $SB /tmp/dynrd trivial.wasm               # read /home: EACCES
    $SB /tmp/dynsock trivial.wasm             # socket: SIGSYS kill
    $SB /tmp/dynexec trivial.wasm             # re-exec: SIGSYS kill
    # RLIMIT_CPU 1s spin -> SIGKILL (137); 600MB malloc under 512MB cap -> fails
