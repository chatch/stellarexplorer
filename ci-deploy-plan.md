# Plan: tag-triggered deploys for web app and API

Status: implemented, then revised for independent component deploys.

Deployments should move from local/manual commands to GitHub Actions, but stay
release-driven: pushing a component version tag deploys one production target.

## Goals

- Deploy the web app to Cloudflare Pages.
- Deploy the API to Fly.io.
- Trigger production deploys only from pushed component version tags.
- Keep web app and API versions independent.
- Keep GitHub Releases hand-curated and separate from deployment automation.
- Preserve the existing local deploy commands as emergency escape hatches.

## Trigger

Use one workflow triggered by component version tags:

```yaml
on:
  push:
    tags:
      - 'v*-app'
      - 'v*-api'
```

The suffix selects the deployment target:

- `v3.1.0-app` deploys the web app and should match the root `package.json`
  version.
- `v1.0.2-api` deploys the API and should match `api/package.json`.

The jobs also have tag-suffix guards so a tag cannot accidentally deploy the
wrong target if the workflow trigger is broadened later.

## Workflow

Create:

```text
.github/workflows/deploy.yml
```

Use two jobs in the same workflow, with job-level tag guards:

- `deploy-web`: builds the Remix/Vite app and deploys `./build/client` to the
  `stellarexplorer` Cloudflare Pages project on branch `master`.
- `deploy-api`: deploys `api/fly.toml` to the `steexp-api` Fly app using Fly's
  remote builder.

Use target-specific concurrency groups so deploys for the same production
target queue instead of racing:

```yaml
concurrency:
  group: deploy-web-production
  cancel-in-progress: false
```

```yaml
concurrency:
  group: deploy-api-production
  cancel-in-progress: false
```

## Proposed workflow file

Pin action versions to full commit SHAs during implementation. Tags are shown
below only to keep the plan readable.

```yaml
name: Deploy

on:
  push:
    tags:
      - 'v*-app'
      - 'v*-api'

permissions:
  contents: read

jobs:
  deploy-web:
    name: Deploy web app
    if: endsWith(github.ref_name, '-app')
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    concurrency:
      group: deploy-web-production
      cancel-in-progress: false
    environment:
      name: production-web
      url: https://steexp.com
    steps:
      - name: Log trigger context
        env:
          TAG: ${{ github.ref_name }}
          SHA: ${{ github.sha }}
          ACTOR: ${{ github.actor }}
        run: |
          echo "Tag:   $TAG"
          echo "SHA:   $SHA"
          echo "Actor: $ACTOR"

      - name: Checkout
        uses: actions/checkout@v4
        with:
          persist-credentials: false

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 11.8.0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
          cache-dependency-path: pnpm-lock.yaml

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm run lint

      - name: Typecheck
        run: pnpm run typecheck

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm run build

      - name: Deploy to Cloudflare Pages
        id: cloudflare
        uses: cloudflare/wrangler-action@v4
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          packageManager: pnpm
          command: >-
            pages deploy ./build/client
            --project-name=stellarexplorer
            --branch=master

      - name: Smoke test web
        run: |
          for i in 1 2 3 4 5 6; do
            code="$(curl -sS -o /dev/null -w '%{http_code}' https://steexp.com || true)"
            if [ "$code" = "200" ]; then
              exit 0
            fi
            sleep 10
          done
          echo "steexp.com returned HTTP $code"
          exit 1

  deploy-api:
    name: Deploy API
    if: endsWith(github.ref_name, '-api')
    runs-on: ubuntu-24.04
    timeout-minutes: 30
    concurrency:
      group: deploy-api-production
      cancel-in-progress: false
    environment:
      name: production-api
      url: https://steexp-api.fly.dev
    steps:
      - name: Log trigger context
        env:
          TAG: ${{ github.ref_name }}
          SHA: ${{ github.sha }}
          ACTOR: ${{ github.actor }}
        run: |
          echo "Tag:   $TAG"
          echo "SHA:   $SHA"
          echo "Actor: $ACTOR"

      - name: Checkout
        uses: actions/checkout@v4
        with:
          persist-credentials: false

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 11.8.0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
          cache-dependency-path: api/pnpm-lock.yaml

      - name: Install API dependencies
        run: pnpm install --frozen-lockfile --ignore-workspace
        working-directory: api

      - name: Audit production API dependencies
        run: pnpm audit --prod --ignore-workspace
        working-directory: api

      - name: Setup flyctl
        uses: superfly/flyctl-actions/setup-flyctl@master

      - name: Verify Fly.io authentication
        run: flyctl auth whoami
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

      - name: Deploy to Fly.io
        run: flyctl deploy --remote-only --app steexp-api
        working-directory: api
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

      - name: Smoke test API
        run: |
          for i in 1 2 3 4 5 6; do
            code="$(curl -sS -o /dev/null -w '%{http_code}' https://steexp-api.fly.dev || true)"
            if [ "$code" = "200" ] || [ "$code" = "404" ]; then
              exit 0
            fi
            sleep 10
          done
          echo "steexp-api.fly.dev returned HTTP $code"
          exit 1
```

Notes:

- `permissions: contents: read` is enough. Do not add `pages: write`; that is
  for GitHub Pages, not Cloudflare Pages.
- Keep the web job's quality gates aligned with the existing CI workflow:
  lint, typecheck, build, and unit tests.
- Keep the API job aligned with existing CI: install with the API lockfile and
  run production dependency audit before deploy.
- Fly's `--remote-only` keeps Docker builds on Fly remote builders, so the
  GitHub runner does not need Docker build setup.
- `flyctl auth whoami` makes token failures explicit before attempting a
  deploy.
- `--app steexp-api` makes the deploy target explicit even though `api/fly.toml`
  already declares the app.
- The API smoke test accepts `404` because the Express root route may not be a
  health endpoint. If there is a real health endpoint, use that and require
  `200`.

## Required secrets

Set these in repository or environment secrets:

| Secret                  | Used by | Notes                                                                               |
| ----------------------- | ------- | ----------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Web     | Cloudflare API token with permission to deploy the `stellarexplorer` Pages project. |
| `CLOUDFLARE_ACCOUNT_ID` | Web     | Cloudflare account that owns the Pages project.                                     |
| `FLY_API_TOKEN`         | API     | Fly token with permission to deploy the `steexp-api` app.                           |

Prefer GitHub environment secrets if production approvals are enabled for
`production-web` or `production-api`; otherwise repository secrets are enough.

Current credential audit from the failed `v3.1.0` deploy:

- No repository or environment secrets exist for `CLOUDFLARE_API_TOKEN` or
  `CLOUDFLARE_ACCOUNT_ID`, so Cloudflare Pages deploys cannot authenticate.
- A repository-level `FLY_API_TOKEN` exists, but Fly.io returned
  `unauthorized` during `flyctl deploy --remote-only`. Replace or regenerate the
  token with permission to deploy the `steexp-api` app.

## GitHub Releases

Do not auto-create GitHub Releases in the deploy workflow.

Existing release notes are hand-written and sometimes include narrative context
or screenshots. Auto-generated release notes would make that worse. Keep release
creation manual:

```sh
gh release create v3.0.2 \
  --title "What shipped in 3.0.2" \
  --notes "Hand-curated release body."
```

The deployment audit trail still exists in:

- the Git tag;
- the GitHub Actions run for that tag;
- the Cloudflare Pages deploy history;
- the Fly.io deploy history.

## AGENTS.md update

Replace the current deployment section with:

```md
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
```

## Implementation order

1. Create or rotate the Cloudflare API token and Fly API token.
2. Add the three secrets to GitHub.
3. Create `.github/workflows/deploy.yml`.
4. Pin all third-party actions to full commit SHAs.
5. Update `AGENTS.md`.
6. Push a real release tag from `master` and watch both jobs.
7. Confirm `https://steexp.com` and `https://steexp-api.fly.dev`.
8. Create the GitHub Release manually.

## Optional hardening

- Add required reviewers to the `production-web` and `production-api`
  environments.
- Use signed tags for releases.
- Add a dedicated API health endpoint and smoke-test that endpoint instead of
  accepting root `404`.
- Replace `superfly/flyctl-actions/setup-flyctl@master` with a pinned commit
  SHA during implementation.
- Add `workflow_dispatch` later only if manual redeploys from the Actions UI
  become useful.
