# Stellar Explorer

[![Node.js CI](https://github.com/chatch/stellarexplorer/actions/workflows/node.js.yml/badge.svg)](https://github.com/chatch/stellarexplorer/actions/workflows/node.js.yml)
[![Run e2e tests against production](https://github.com/chatch/stellarexplorer/actions/workflows/playwright-production.yml/badge.svg)](https://github.com/chatch/stellarexplorer/actions/workflows/playwright-production.yml)

A ledger explorer for [Stellar](https://stellar.org).

Deployments:

- Public: <https://steexp.com>
- Test: <https://testnet.steexp.com>
- Futurenet: <https://futurenet.steexp.com>
- Local: <http://localhost:3000>

## Resources

### Lists

| Resource           | URI                                               |
| ------------------ | ------------------------------------------------- |
| Operations         | [/operations](https://steexp.com/operations)      |
| Transactions       | [/txs](https://steexp.com/txs)                    |
| Ledgers            | [/ledgers](https://steexp.com/ledgers)            |
| Payments           | [/payments](https://steexp.com/payments)          |
| Trades             | [/trades](https://steexp.com/trades)              |
| Effects            | [/effects](https://steexp.com/effects)            |
| Liquidity Pools    | [/effects](https://steexp.com/pools)              |
| Claimable Balances | [/effects](https://steexp.com/claimable-balances) |

### Directory

| Resource  | URI                                        |
| --------- | ------------------------------------------ |
| Assets    | [/assets](https://steexp.com/assets)       |
| Anchors   | [/anchors](https://steexp.com/anchors)     |
| Exchanges | [/exchanges](https://steexp.com/exchanges) |

### Accounts

| Resource               | URI                                                                                                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| by Federated address   | [/account/stellar\*fed.network](https://steexp.com/account/stellar*fed.network)                                                                                                    |
| by Public address      | [/account/GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX](https://steexp.com/account/GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX)                           |
| by Multiplexed address | [/account/MDZ464OWNGEL4X2DE6JPLEARO2WJ4AGCBN3XM7E4ZSLPHRBV6AZB6AAAAAAAAAAAAGW4M](https://steexp.com/account/MDZ464OWNGEL4X2DE6JPLEARO2WJ4AGCBN3XM7E4ZSLPHRBV6AZB6AAAAAAAAAAAAGW4M) |

#### Tabs

| Resource         | URI                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| Balances Tab     | [/account/stellar\*fed.network#balances](https://steexp.com/account/stellar*fed.network#balances)         |
| Payments Tab     | [/account/stellar\*fed.network#payments](https://steexp.com/account/stellar*fed.network#payments)         |
| Offers Tab       | [/account/stellar\*fed.network#offers](https://steexp.com/account/stellar*fed.network#offers)             |
| Trades Tab       | [/account/stellar\*fed.network#trades](https://steexp.com/account/stellar*fed.network#trades)             |
| Effects Tab      | [/account/stellar\*fed.network#effects](https://steexp.com/account/stellar*fed.network#effects)           |
| Operations Tab   | [/account/stellar\*fed.network#operations](https://steexp.com/account/stellar*fed.network#operations)     |
| Transactions Tab | [/account/stellar\*fed.network#transactions](https://steexp.com/account/stellar*fed.network#transactions) |
| Signing Tab      | [/account/stellar\*fed.network#signing](https://steexp.com/account/stellar*fed.network#signing)           |
| Flags Tab        | [/account/stellar\*fed.network#flags](https://steexp.com/account/stellar*fed.network#flags)               |
| Data Tab         | [/account/stellar\*fed.network#data](https://steexp.com/account/stellar*fed.network#data)                 |

### Search

| Resource              | URI                                                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Federated address     | [/search/steexp\*fed.network](https://steexp.com/search/steexp*fed.network)                                                                                                      |
| Public address        | [/search/GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX](https://steexp.com/search/GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX)                           |
| Multiplexed address   | [/search/MDZ464OWNGEL4X2DE6JPLEARO2WJ4AGCBN3XM7E4ZSLPHRBV6AZB6AAAAAAAAAAAAGW4M](https://steexp.com/search/MDZ464OWNGEL4X2DE6JPLEARO2WJ4AGCBN3XM7E4ZSLPHRBV6AZB6AAAAAAAAAAAAGW4M) |
| Ledger                | [/search/10000000](https://steexp.com/search/10000000)                                                                                                                           |
| Transaction           | [/search/26a568681712a44a515b2c90dcfaadb3ed2c40dc60254638407937bee4767071](https://steexp.com/search/26a568681712a44a515b2c90dcfaadb3ed2c40dc60254638407937bee4767071)           |
| Asset Code            | [/search/NGN](https://steexp.com/search/NGN)                                                                                                                                     |
| Anchor Name           | [/search/ripplefox](https://steexp.com/search/ripplefox)                                                                                                                         |
| Anchor Name (Partial) | [/search/fox](https://steexp.com/search/fox)                                                                                                                                     |

### Misc

| Resource    | URI                                                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Transaction | [/tx/26a568681712a44a515b2c90dcfaadb3ed2c40dc60254638407937bee4767071](https://steexp.com/tx/26a568681712a44a515b2c90dcfaadb3ed2c40dc60254638407937bee4767071) |
| Ledger      | [/ledger/10000000](https://steexp.com/ledger/10000000)                                                                                                         |
| Anchor      | [/anchor/apay.io](https://steexp.com/anchor/apay.io)                                                                                                           |
| Asset       | [/asset/NGN](https://steexp.com/asset/NGN)                                                                                                                     |

## Exploring Private / Local Development Networks<a name="private-networks"></a>

steexp will connect to a local horizon instance at <http://localhost:8000> by default. If your running a local private network for development this is quite handy for browsing your changes to the ledger.

Alternatively you can run locally connecting to the testnet or public network horizon instances. To do this define these aliases to localhost:

```sh
127.0.1.1  testnet.local     # for steexp use testnet horizon
127.0.1.1  publicnet.local   # for steexp use mainnet horizon
127.0.1.1  futurenet.local   # for steexp use future horizon
```

> Use 127.0.0.1 instead of 127.0.1.1 when the above doesn't work.

Navigate to <http://testnet.local:3000>, <http://futurenet.local:3000> or <http://publicnet.local:3000> to select the network your interesting in exploring.

## Development

See the section [Exploring Private / Local Development Networks](#private-networks) for connecting to different backend networks. By default steexp will look for a local instance of horizon.

### Start

```sh
pnpm i && pnpm dev
```

### Test

```sh
pnpm i && pnpm test
```

or

You can run test with Jest Preview with the following command. You can see the result at <http://locahost:3336> for test using React Testing Library along with Jest Preview.

```sh
pnpm test:preview
```

or

You can run test and Jest Preview separately as follows (this is basically same as the previous one).

```sh
pnpm jest-preview

pnpm test
or
pnpm test:watch
```

### E2E Test

```sh
pnpm test:e2e
```

Run the test in UI mode:

```sh
pnpm test:e2e:ui
```

Show HTML test reports:

```sh
pnpm test:e2e:report
```

### Build

```sh
pnpm i && pnpm build
```

`pnpm build` is the centralized Cloudflare Pages build. It keeps the app
root-based for <https://steexp.com> and the existing Pages SPA fallback.

`pnpm build:decentralized` sets `STEEXP_BUILD_TARGET=decentralized` and emits a
static SPA build with relative Vite asset URLs. This target is intended for
IPFS DNSLink/subdomain gateways, ArNS/custom Arweave entrypoints, or any
gateway/domain that serves the app at path root. Direct refreshes on nested
routes still require the gateway to serve `index.html` as the SPA fallback. Raw
path gateways such as `/ipfs/<cid>/...` or `/arweave-id/...` are not supported
by this target.

### Deploy to IPFS

The decentralized build should be served from a gateway origin root. Use an IPFS
subdomain gateway or DNSLink/custom domain, not a path gateway URL such as
`https://ipfs.io/ipfs/<cid>/...`.

```sh
pnpm build:decentralized
ipfs add -r --cid-version=1 --pin=true build/client
```

The last CID printed for `build/client` is the site root CID. Verify it with a
subdomain gateway:

```sh
CID=<site-root-cid>
open "https://${CID}.ipfs.dweb.link/"
```

For a custom domain, publish a DNSLink TXT record:

```txt
_dnslink.example.com.  TXT  "dnslink=/ipfs/<site-root-cid>"
```

Then point the domain at an IPFS gateway that supports DNSLink. The app expects
the gateway to serve `index.html` for deep links such as `/operations`; if the
gateway does not provide SPA fallback, users should enter through `/`.

If you use a pinning service instead of your own Kubo node, upload the whole
`build/client` directory and pin the returned directory CID. The same DNSLink
and SPA fallback notes apply.

### Deploy to Arweave

The Arweave target is also root-oriented. Use an ArNS name or custom Arweave
gateway entrypoint that serves the uploaded manifest at `/`. A raw manifest
transaction URL such as `https://arweave.net/<manifest-tx-id>/...` is useful for
inspection, but it is not the intended production URL for this app.

Turbo can upload the folder and create an Arweave path manifest:

```sh
pnpm build:decentralized
pnpm add -g @ardrive/turbo-sdk
turbo upload-folder \
  --folder-path build/client \
  --index-file index.html \
  --fallback-file index.html \
  --token arweave \
  --wallet-file /path/to/arweave-wallet.json
```

Save the returned manifest transaction id. The `--fallback-file index.html`
setting is important for SPA route refreshes when the gateway honors manifest
fallbacks.

After upload, point your ArNS name or custom Arweave gateway routing at the
manifest transaction id. Verify the production URL is root-style, for example:

```txt
https://your-name.arweave.net/
https://your-domain.example/
```

Do not publish a decentralized release that only works at
`https://arweave.net/<manifest-tx-id>/`; that path-style gateway shape is out of
scope for this build target.

## Languages

Use the language selector in the top right corner to change the language.

Translation files are here:
<https://github.com/chatch/stellarexplorer/tree/master/src/languages>

Submit pull requests with new languages or languages fixes there.

## Scripts

### Fetch and restructure centralized exchanges data

```sh
pnpm exec ts-node scripts/restructure-centralized-exchanges-json.ts
```
