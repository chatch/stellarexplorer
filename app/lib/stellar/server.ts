import { Horizon } from 'stellar-sdk'

import type { NetworkKey } from './networks'
import networks, { requestToNetworkDetails } from './networks'
import SorobanServer, { sorobanRpcURIs } from './server_soroban'
import { isLocalhost } from './utils'
import { isValidUrl } from '../utils'

export const defaultNetworkAddresses: Record<string, string> = {
  public: 'https://horizon.stellar.org',
  test: 'https://horizon-testnet.stellar.org',
  future: 'https://horizon-futurenet.stellar.org',
  local: 'http://localhost:8000',
}

export interface HorizonServerDetails {
  serverAddress: string
  networkType: NetworkKey | null
  requestURL: string
}

/**
 * Wrap the stellar-sdk Server.
 */
class HorizonServer extends Horizon.Server {
  constructor(networkAddress: string, networkType?: string) {
    // allowHttp: public/test use HTTPS; local can use HTTP
    super(networkAddress, {
      allowHttp: networkType === networks.local || isLocalhost(networkAddress),
    })
  }
}

const requestToServer = async (request: Request): Promise<HorizonServer> => {
  const { networkType, customHorizonAddress } =
    await requestToNetworkDetails(request)

  let server: HorizonServer

  if (isValidUrl(customHorizonAddress)) {
    server = new HorizonServer(customHorizonAddress)
  } else {
    server = new HorizonServer(
      defaultNetworkAddresses[networkType],
      networkType,
    )
  }

  return server
}

const requestToServerDetails = async (
  request: Request,
): Promise<HorizonServerDetails> => {
  const { networkType, customHorizonAddress } =
    await requestToNetworkDetails(request)

  const serverAddress: string = isValidUrl(customHorizonAddress)
    ? customHorizonAddress
    : defaultNetworkAddresses[networkType]

  return { serverAddress, networkType, requestURL: request.url }
}

const requestToSorobanServer = async (
  request: Request,
): Promise<SorobanServer> => {
  const { networkType, customSorobanRPCAddress } =
    await requestToNetworkDetails(request)

  let server: SorobanServer

  if (isValidUrl(customSorobanRPCAddress)) {
    server = new SorobanServer(customSorobanRPCAddress)
  } else {
    server = new SorobanServer(sorobanRpcURIs[networkType], networkType)
  }

  return server
}

export {
  HorizonServer as default,
  requestToServer,
  requestToServerDetails,
  requestToSorobanServer,
}
