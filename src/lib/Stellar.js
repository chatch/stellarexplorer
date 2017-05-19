const sdk = require('stellar-sdk')

const TESTNET = 'https://horizon-testnet.stellar.org'
const PUBNET = 'https://horizon.stellar.org'

const usePubNet = false   // TODO: parameterise
const horizonUrl = (usePubNet) ? PUBNET : TESTNET
const server = new sdk.Server(horizonUrl)
if (!usePubNet)
    sdk.Network.useTestNetwork()

export { sdk, server }
