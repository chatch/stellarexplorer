import { Horizon } from 'stellar-sdk'

import networks, { requestToNetworkDetails } from './networks'
import SorobanServer, { sorobanRpcURIs } from './server_soroban'

export const defaultNetworkAddresses: Record<string, string> = {
  public: 'https://horizon.stellar.org',
  test: 'https://horizon-testnet.stellar.org',
  future: 'https://horizon-futurenet.stellar.org',
  local: 'http://localhost:8000',
}

/**
 * Wrap the stellar-sdk Server.
 */
class HorizonServer extends Horizon.Server {
  constructor(networkType: string, networkAddress: string) {
    // allowHttp: public/test use HTTPS; local can use HTTP
    super(networkAddress, { allowHttp: networkType === networks.local })
  }
}

const requestToServer = (request: Request): HorizonServer => {
  const { networkType } = requestToNetworkDetails(request)
  return new HorizonServer(networkType, defaultNetworkAddresses[networkType])
}

const requestToSorobanServer = (request: Request): SorobanServer => {
  const { networkType } = requestToNetworkDetails(request)
  if (![networks.future, networks.test, networks.local].includes(networkType)) {
    throw new Error(
      `Soroban smart contracts not yet supported on the network [${networkType}].`,
    )
  }
  return new SorobanServer(networkType, sorobanRpcURIs[networkType])
}

export { HorizonServer as default, requestToServer, requestToSorobanServer }
