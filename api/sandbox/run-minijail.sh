#!/bin/sh
# Sandbox wrapper for running wabt tools on untrusted .wasm uploads, using
# Google's minijail0 (see api/sandbox/README.md for the full rationale).
#
# Usage: run-minijail.sh <tool-path> <input.wasm> [tool-args...]
#
# Layers applied to the jailed tool process:
#   - rlimits: AS/CPU/FSIZE/NOFILE (DoS bugs #2316-2322)
#   - uid/gid drop to nobody (only when running as root, i.e. in the
#     container; local dev runs unsandboxed-uid with a warning-free skip)
#   - Landlock filesystem rules: read+execute on the tool dir and loader
#     libs, read-only on /usr /etc /dev and the input file, NO write access
#     anywhere (--landlock-abi 5 to also mediate Truncate/IoctlDev; minijail
#     clamps to the kernel's ABI, and silently skips Landlock on kernels
#     without it — check for that once per environment, see README)
#   - seccomp allowlist (wabt.seccomp.policy), installed post-exec via
#     minijail's LD_PRELOAD hook; deny action = kill
#
# Overridable for local dev / tests:
#   MINIJAIL0         path to minijail0 binary
#   MINIJAIL_PRELOAD  path to libminijailpreload.so
set -eu

TOOL="$1"
INPUT="$2"

MJ0="${MINIJAIL0:-/usr/local/bin/minijail0}"
PRELOAD="${MINIJAIL_PRELOAD:-/usr/local/lib/libminijailpreload.so}"
POLICY="$(dirname "$0")/wabt.seccomp.policy"

DROP=''
if [ "$(id -u)" = '0' ]; then
  DROP='-u nobody -g nogroup'
fi

exec "$MJ0" \
  --preload-library="$PRELOAD" \
  --landlock-abi 5 \
  -n \
  $DROP \
  -R RLIMIT_AS,536870912,536870912 \
  -R RLIMIT_CPU,30,30 \
  -R RLIMIT_FSIZE,268435456,268435456 \
  -R RLIMIT_NOFILE,64,64 \
  -R RLIMIT_CORE,0,0 \
  -S "$POLICY" \
  --fs-path-rx "$(dirname "$TOOL")" \
  --fs-path-rx /lib --fs-path-rx /lib64 --fs-path-rx /usr/lib \
  --fs-path-ro /usr --fs-path-ro /etc --fs-path-ro /dev \
  --fs-path-ro "$INPUT" \
  --env-reset --env-add PATH=/usr/bin:/bin --env-add LANG=C \
  -- "$TOOL" "$INPUT"
