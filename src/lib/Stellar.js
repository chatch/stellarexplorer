const sdk = require('stellar-sdk')

const TESTNET = 'https://horizon-testnet.stellar.org'
const PUBNET = 'https://horizon.stellar.org'
// const LOCALNET = 'http://localhost:8000'

const isPubNet = true // TODO: parameterise
const horizonUrl = (isPubNet)
  ? PUBNET
  : TESTNET

const server = new sdk.Server(horizonUrl, {allowHttp: true})
if (!isPubNet)
  sdk.Network.useTestNetwork()

export {sdk, server, isPubNet}
