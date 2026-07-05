# Agent Guidelines

## Package management

Always use pnpm instead of npm.

## Local Development

1. Run `pnpm dev` to start the development server.
2. Navigate to [http://publicnet.local:3000](http://publicnet.local:3000).

## Daily Workflow

- Run lint and test after a set of changes is complete.

## Deployment

Deployment is **manual from a local dev box** — there are no GitHub Actions deploy
workflows. `.github/workflows/` only contains CI (`node.js.yml`) and scheduled
Playwright e2e against production (`playwright-production.yml`).

| Component | Host        | Deploy command (run from local)                                    | Triggered from |
| --------- | ----------- | ------------------------------------------------------------------ | -------------- |
| Web app   | Cloudflare Pages (`stellarexplorer`, branch `master`) | `pnpm pages:deploy` (alias for `pnpm build && wrangler pages deploy ./build/client --branch master`) | repo root |
| API       | Fly.io (`steexp-api`, region `sin`)                  | `fly deploy --remote-only`                                          | `api/`         |

Notes:

- The web app was migrated from Fly.io to Cloudflare Pages when it became
  client-only. The root `fly.toml` and `Dockerfile` are leftover from that era
  and are **not** used; only `api/fly.toml` and `api/Dockerfile` are live.
- The API stays on Fly because it shells out to native binaries (`wabt`,
  `soroban-cli`) for WASM decompilation and needs a real VM.
- DNS for `steexp.com` is hosted on Cloudflare (nameservers
  `karsyn.ns.cloudflare.com`, `lennon.ns.cloudflare.com`).
- Web → API URL is hardcoded in `app/lib/stellar/contracts.ts` as
  `https://steexp-api.fly.dev`.
