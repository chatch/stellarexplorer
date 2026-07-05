# Agent Guidelines

## Package management

Always use pnpm instead of npm.

## Local Development

1. Run `pnpm dev` to start the development server.
2. Navigate to [http://publicnet.local:3000](http://publicnet.local:3000).

## Daily Workflow

- Run lint and test after a set of changes is complete.

## Deployment

Production deploys are tag-triggered in GitHub Actions.

| Component | Host                                                  | Trigger                  | Workflow                       |
| --------- | ----------------------------------------------------- | ------------------------ | ------------------------------ |
| Web app   | Cloudflare Pages (`stellarexplorer`, branch `master`) | Push a tag matching `v*` | `.github/workflows/deploy.yml` |
| API       | Fly.io (`steexp-api`, region `sin`)                   | Push a tag matching `v*` | `.github/workflows/deploy.yml` |

Release flow:

1. Merge the release commit to `master`.
2. Create a version tag, for example `git tag v3.0.2`.
3. Push the tag with `git push origin v3.0.2`.
4. Watch the `Deploy` workflow.
5. Create the GitHub Release manually with curated notes.

Emergency local deploy commands are still available:

- Web: `pnpm pages:deploy`
- API: `cd api && pnpm deploy`

Required GitHub secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `FLY_API_TOKEN`

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
