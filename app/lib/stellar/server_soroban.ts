import { SorobanRpc } from 'stellar-sdk'
import networks from './networks'
import { isLocalhost } from './utils'

export const sorobanRpcURIs: Record<string, string> = {
  [networks.public]: 'https://soroban-rpc.mainnet.stellar.gateway.fm',
  [networks.future]: 'https://rpc-futurenet.stellar.org',
  [networks.test]: 'https://soroban-testnet.stellar.org',
  [networks.local]: 'http://localhost:8000/soroban/rpc',
}

/**
 * Wrap the soroban-client Server.
 */
class SorobanServer extends SorobanRpc.Server {
  constructor(networkAddress: string, networkType?: string) {
    // allowHttp: public/test use HTTPS; local can use HTTP
    super(networkAddress, {
      allowHttp: networkType === networks.local || isLocalhost(networkAddress),
    })
  }
}

export default SorobanServer
