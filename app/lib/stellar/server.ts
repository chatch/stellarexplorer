import { Horizon } from 'stellar-sdk'

import networks, { requestToNetworkDetails } from './networks'
import SorobanServer, { sorobanRpcURIs } from './server_soroban'
import { getSession } from '~/sessions'
import { isLocalhost } from './utils'

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
  constructor(networkAddress: string, networkType?: string) {
    // allowHttp: public/test use HTTPS; local can use HTTP
    super(networkAddress, {
      allowHttp: networkType === networks.local || isLocalhost(networkAddress),
    })
  }
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

const requestToServer = async (request: Request): Promise<HorizonServer> => {
  const session = await getSession(request.headers.get('Cookie'))
  const horizonAddress = session.get('horizonAddress') as string

  let server: HorizonServer

  if (isValidUrl(horizonAddress)) {
    server = new HorizonServer(horizonAddress)
  } else {
    const { networkType } = requestToNetworkDetails(request)
    server = new HorizonServer(
      defaultNetworkAddresses[networkType],
      networkType,
    )
  }

  return server
}

const requestToSorobanServer = async (
  request: Request,
): Promise<SorobanServer> => {
  const session = await getSession(request.headers.get('Cookie'))
  const sorobanRPCAddress = session.get('sorobanRPCAddress') as string

  let server: SorobanServer

  if (isValidUrl(sorobanRPCAddress)) {
    server = new SorobanServer(sorobanRPCAddress)
  } else {
    const { networkType } = requestToNetworkDetails(request)
    server = new SorobanServer(sorobanRpcURIs[networkType], networkType)
  }

  return server
}

export { HorizonServer as default, requestToServer, requestToSorobanServer }
