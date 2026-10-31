# Security Policy

## Supported Versions

stellarexplorer is an application deployed by tag, not an npm package. Security
fixes are applied to the latest published release of each component:

| Component       | Release tag | Supported               |
| --------------- | ----------- | ----------------------- |
| Web app (Remix) | `v*-app`    | ✅ latest published tag |
| API (Express)   | `v*-api`    | ✅ latest published tag |
| Older tags      | —           | ❌ (update to latest)   |

The deployed instances at [steexp.com](https://steexp.com) (web) and
[steexp-api.fly.dev](https://steexp-api.fly.dev) (API) always track the latest
tags.

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

This project has [private vulnerability reporting](https://github.com/chatch/stellarexplorer/security/advisories/new) enabled. Use the **Report a vulnerability** button there to submit a report privately to the maintainer. Reports stay private until a fix is published.

### What to include

- A description of the vulnerability and its impact
- Steps to reproduce (a minimal example is ideal — e.g. a wasm file that
  triggers the issue)
- Affected component (web app / API) and, if known, the release tag
- Any known workarounds

### Scope

stellarexplorer is a read-only ledger explorer: the web client holds no keys or
funds, and the API's main attack surface is processing untrusted contract
bytecode. Issues in scope include:

- **Web client** — cross-site scripting or injection via ledger data
  (transactions, contract metadata, account data) rendered by the explorer;
  unsafe handling of user-supplied state
- **API input handling** — malicious `.wasm` uploads escaping the upload
  directory, exceeding resource limits, or exploiting the decompilation
  tooling (`wabt`, `soroban-cli`) to gain code execution or denial of service
- **API abuse** — bypassing rate limits, path traversal, or unauthenticated
  access to endpoints that should be constrained
- **Dependency-introduced vulnerabilities** in either component's runtime
  dependencies

Not in scope: the Stellar protocol itself, Horizon or RPC nodes operated by
the Stellar Development Foundation or third parties, vulnerabilities in
wallets or applications that link to this explorer, and the privacy of ledger
data (everything the explorer shows is already public on-chain).

### Response expectations

- Acknowledgement within **7 days**
- Triage outcome (accepted / needs more info / declined) within **14 days**
- Accepted vulnerabilities are fixed and disclosed via a [GitHub security
  advisory](https://github.com/chatch/stellarexplorer/security/advisories)
  once a patched release tag is deployed, with credit to the reporter unless
  anonymity is requested

This project is maintained by a single maintainer on a best-effort basis;
timelines may be longer for complex issues.

## Security features of this project

- Dependencies kept up to date via Dependabot (security updates + a monthly
  dependency-refresh workflow) with `pnpm audit` gates in CI
- Static analysis (CodeQL, `security-extended`) runs on every push and PR;
  OpenSSF Scorecard results are published to the Security tab
- `dependency-review` runs on every pull request
- A CycloneDX SBOM is attached to every GitHub release for both components
- The API rate-limits expensive endpoints (wasm decompilation) and enforces
  upload size limits on untrusted `.wasm` files
- Secret scanning with push protection is enabled on this repository
