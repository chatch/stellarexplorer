import sdk from './sdk'
import networks from './networks'
import has from 'lodash/has'

const serverAddresses = {
  public: 'https://horizon.stellar.org',
  test: 'https://horizon-testnet.stellar.org',
  local: 'http://localhost:8000',
}

/**
 * Wrap the stellar-sdk Server hiding setup of horizon addresses and adding
 * some helper functions. These helpers are more easily mocked for testing then
 * direct use of sdk fluent api.
 */
class WrappedServer extends sdk.Server {
  constructor(network) {
    if (!has(networks, network)) throw new Error(`network ${network} unknown`)

    if (network === networks.public) sdk.Network.usePublicNetwork()
    else if (network === networks.test) sdk.Network.useTestNetwork()

    // allowHttp: public/test use HTTPS; local can use HTTP
    super(serverAddresses[network], {allowHttp: network === networks.local})
  }

  //
  // Horizon url resolvers
  //

  accountURL = id => `${this.serverURL}accounts/${id}`
  effectURL = id => `${this.serverURL}operations/${id}/effects`
  ledgerURL = id => `${this.serverURL}ledgers/${id}`
  opURL = id => `${this.serverURL}operations/${id}`
  txURL = id => `${this.serverURL}transactions/${id}`
}

const Server = network => new WrappedServer(network)

export default Server
