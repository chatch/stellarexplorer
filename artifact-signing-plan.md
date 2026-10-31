# Artifact signing plan (deferred)

Written ahead of the post-hardening release; parked so we can pick it up later.
Status: **planned, not started.** Signing build-out should land _before_ the
next release so the first signed artifacts ship together.

## Context

- master is ~14 commits ahead of `v3.1.3-app` / `v1.0.8-api` (CI hardening,
  dep upgrades, SBOM attach). Release is otherwise ready; notes will be thin
  ("dependency refresh, hardened CI").
- SBOMs already generated (CycloneDX) and attached to GitHub releases for both
  web app and API — but unsigned.
- Only the API has a Docker image; it's built by Fly's remote builder, outside
  GitHub Actions, so there's nothing in a registry we control to sign today.
- Web app is client-only static on Cloudflare Pages — no image, SBOM only.

## Why sign (decided)

Audience is **hygiene, not active verification**. Paranoid / high-security
users — some crypto users and orgs — may check provenance, but few will.
Cosign keyless (Sigstore OIDC from Actions, no key management, free) is the
right fit: it costs us little, and it signals the right thing to exactly the
users who care. No long-lived signing keys, no KMS.

## Scope

| Artifact              | Sign? | How                                            |
| --------------------- | ----- | ---------------------------------------------- |
| API Docker image      | yes   | cosign keyless + SLSA provenance + SBOM attest |
| SBOMs (web + api)     | yes   | `cosign sign-blob --bundle`, bundle on release |
| Web app static assets | no    | signing Cloudflare-delivered JS adds little    |

## Approach

### 1. API image → GHCR, then digest-pinned Fly deploy

- Deploy workflow builds/pushes the API image to GHCR.
- Sign with `cosign sign --keyless` (identity bound to this repo + workflow).
- Attach attestations: SLSA provenance (`cosign attest`) + CycloneDX SBOM.
- `fly deploy --image ghcr.io/...@sha256:...` — digest-pinned, so what we
  signed is exactly what runs. This replaces Fly's remote builder for the
  image build; `api/Dockerfile` stays the source of truth.
- Moderate change to the `Deploy API` job in `.github/workflows/deploy.yml`,
  not a rewrite. New workflow permissions: `packages: write`, `id-token: write`.

### 2. Sign SBOMs as blobs

- After generating each CycloneDX SBOM: `cosign sign-blob --bundle`.
- Upload the `.sigstore` bundle next to the SBOM in the GitHub release
  (workflow artifacts keep them until the release exists — same pattern as
  today's SBOM upload step).

### 3. (Optional, later) SLSA provenance level bump

- If we ever want formal SLSA levels, the GHCR+Actions path above already
  gets most of the way. Revisit only if a real consumer asks.

## Release sequencing (when picked back up)

1. Land signing build-out (1–2 PRs: ① GHCR + cosign + attestations for API
   image, ② signed SBOMs). CI green each step.
2. Verify: `cosign verify` the GHCR image, check release assets have bundles.
3. Then the ordinary release: bump root `package.json` → `3.1.4` and
   `api/package.json` → `1.0.9`, merge, tag `v3.1.4-app` + `v1.0.9-api`,
   watch Deploy, verify `/health` + signed release assets, write GitHub
   Releases (notes thin; lead with dependency/security hardening).

## Out of scope / decisions made

- **PR #720** (decentralized static build target): not ready — deferred,
  would have made release notes meatier but is unreviewed scope.
- Fly registry signing post-hoc (sign whatever Fly built after deploy):
  rejected — weaker guarantee, wrong order.
- Signing web app static bundles: rejected.
