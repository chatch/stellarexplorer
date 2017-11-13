# Stellar Explorer
[![Build Status](https://travis-ci.org/chatch/stellarexplorer.svg?branch=master)](https://travis-ci.org/chatch/stellarexplorer)

Public: https://steexp.com |
Test: https://testnet.steexp.com |
Local: http://localhost:3000

A ledger explorer for the [Stellar](https://stellar.org).

## Resources
Resource|URI
---|---
Latest Operations|[/operations](https://steexp.com/operations)
Latest Transactions|[/txs](https://steexp.com/txs)
Latest Ledgers|[/ledgers](https://steexp.com/ledgers)
Account by Federated address|[/account/stellar*fed.network](https://steexp.com/account/stellar*fed.network)
Account by Public address|[/account/GBAM...](https://steexp.com/account/GBAMBOOZDWZPVV52RCLJQYMQNXOBLOXWNQAY2IF2FREV2WL46DBCH3BE)
Account Effects|[/account/stellar*fed.network#effects](https://steexp.com/account/stellar*fed.network#effects)
Account Operations|[/account/stellar*fed.network#operations](https://steexp.com/account/stellar*fed.network#operations)
Transaction|[/tx/26a568681...](https://steexp.com/tx/26a568681712a44a515b2c90dcfaadb3ed2c40dc60254638407937bee4767071)
Ledger|[/ledger/10000000](https://steexp.com/ledger/10000000)

## Lists
List|URI
---|---
Anchors|[/anchors](https://steexp.com/anchors)
Exchanges|[/exchanges](https://steexp.com/exchanges)

## Languages
Use the language selector in the top right corner to change the language.

Translation files are here:
https://github.com/chatch/stellarexplorer/tree/master/src/languages

Submit pull requests with new languages or languages fixes there.

## Exploring Private / Local Development Networks<a name="private-networks"></a>

steexp will connect to a local horizon instance at (http://localhost:8000) by default. If your running a local private network for development this is quite handy easily browsing your changes to the ledger.

Alternatively you can run locally connecting to the testnet or public network horizon instances. To do this define these hosts to point to your localhost:
```
127.0.1.1	testnet.local   # for steexp testnet horizon
127.0.1.1 publicnet.local   # for steexp use mainnet horizon
```

Restart steexp then navigate to testnet.local:3000 or publicnet.local as required.

## Development

NOTE: use npm instead of yarn to install the dependencies (see #15 for details)

Start the server:
```
npm i && yarn start
```
See the section [Exploring Private / Local Development Networks](#private-networks) for connecting to different backend networks. By default steexp will look for a local instance of horizon.

Tests:
```
npm i && yarn test
```

Build:
```
npm i && yarn build
```

