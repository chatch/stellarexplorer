import networks, { requestToNetworkDetails } from './networks'
import sdk from './sdk'

export const defaultNetworkAddresses: Record<string, string> = {
    public: 'https://horizon.stellar.org',
    test: 'https://horizon-testnet.stellar.org',
    future: 'https://horizon-futurenet.stellar.org',
    local: 'http://localhost:8000',
}

/**
 * Wrap the stellar-sdk Server hiding setup of horizon addresses and adding
 * some helper functions. These helpers are more easily mocked for testing then
 * direct use of sdk fluent api.
 */
class HorizonServer extends sdk.Server {
    constructor(networkType: string, networkAddress: string) {
        // allowHttp: public/test use HTTPS; local can use HTTP
        super(networkAddress, { allowHttp: networkType === networks.local })
    }

    //
    // Horizon url resolvers
    //
    accountURL = (id: string) => `${this.serverURL}accounts/${id}`
    effectURL = (id: string) => `${this.serverURL}operations/${id}/effects`
    ledgerURL = (id: string) => `${this.serverURL}ledgers/${id}`
    opURL = (id: string) => `${this.serverURL}operations/${id}`
    txURL = (id: string) => `${this.serverURL}transactions/${id}`
}

const requestToServer = (request: Request): HorizonServer => {
    const { networkType } = requestToNetworkDetails(request)
    return new HorizonServer(
        networkType,
        defaultNetworkAddresses[networkType]
    )
}

export { HorizonServer as default, requestToServer }