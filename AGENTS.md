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

| Component | Host                                                  | Trigger                      | Workflow                       |
| --------- | ----------------------------------------------------- | ---------------------------- | ------------------------------ |
| Web app   | Cloudflare Pages (`stellarexplorer`, branch `master`) | Push a tag matching `v*-app` | `.github/workflows/deploy.yml` |
| API       | Fly.io (`steexp-api`, region `sin`)                   | Push a tag matching `v*-api` | `.github/workflows/deploy.yml` |

The root `package.json` version is the web app version. `api/package.json`
version is the API version. Keep them independent.

Web app release flow:

1. Bump the root `package.json` version, for example to `3.1.0`.
2. Merge or push the release commit to `master`.
3. Create an app tag, for example `git tag v3.1.0-app`.
4. Push the tag with `git push origin v3.1.0-app`.
5. Watch the `Deploy` workflow's `Deploy web app` job.
6. Create the GitHub Release manually with curated notes.

API release flow:

1. Bump `api/package.json`, for example to `1.0.2`.
2. Merge or push the release commit to `master`.
3. Create an API tag, for example `git tag v1.0.2-api`.
4. Push the tag with `git push origin v1.0.2-api`.
5. Watch the `Deploy` workflow's `Deploy API` job.
6. Create the GitHub Release manually with curated notes.

Emergency local deploy commands are still available:

- Web: `pnpm pages:deploy`
- API: `cd api && pnpm deploy`

Required GitHub secrets:

- `CLOUDFLARE_API_TOKEN`: Cloudflare token that can deploy the
  `stellarexplorer` Pages project.
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account that owns the Pages project.
- `FLY_API_TOKEN`: Fly.io token that can deploy the `steexp-api` app.

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
