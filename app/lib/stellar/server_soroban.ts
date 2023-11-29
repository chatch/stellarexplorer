import { SorobanRpc } from 'stellar-sdk'
import networks from './networks'

export const sorobanRpcURIs: Record<string, string> = {
  [networks.future]: 'https://rpc-futurenet.stellar.org',
  [networks.test]: 'https://soroban-testnet.stellar.org',
  [networks.local]: 'http://localhost:8000/soroban/rpc',
}

/**
 * Wrap the soroban-client Server.
 */
class SorobanServer extends SorobanRpc.Server {
  constructor(networkType: string, networkAddress: string) {
    // allowHttp: public/test use HTTPS; local can use HTTP
    super(networkAddress, { allowHttp: networkType === networks.local })
  }
}

export default SorobanServer
