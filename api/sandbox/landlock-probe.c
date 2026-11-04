// Reports whether the running kernel supports Landlock, and which ABI.
//
// Used by the API at startup to log whether the wabt sandbox is running with
// full filesystem confinement (Landlock present) or only the layers that do
// not need kernel support (seccomp + uid drop + rlimits). Pure syscall probe:
// no headers needed beyond the raw numbers, so it builds anywhere.
//
// Exit status / output:
//   0 and "abi=<n>"   kernel supports Landlock
//   0 and "unsupported" kernel lacks Landlock (ENOSYS/EOPNOTSUPP)

#include <errno.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/syscall.h>

#ifndef __NR_landlock_create_ruleset
#if defined(__x86_64__)
#define __NR_landlock_create_ruleset 444
#elif defined(__aarch64__)
#define __NR_landlock_create_ruleset 444
#endif
#endif

/* LANDLOCK_CREATE_RULESET_VERSION = 1 */
#define LANDLOCK_CREATE_RULESET_VERSION 1

int main(void) {
  long abi = syscall(__NR_landlock_create_ruleset, NULL, 0,
                     LANDLOCK_CREATE_RULESET_VERSION);
  if (abi < 0) {
    /* ENOSYS: not compiled in. EOPNOTSUPP: LSM present but disabled. */
    printf("unsupported errno=%d\n", (int)errno);
    return 0;
  }
  printf("abi=%ld\n", abi);
  return 0;
}
