import axios from 'axios'

const post = (url, method, ...params) => {
  if (params && params.length < 1) {
    params = null
  }

  const request = {
    jsonrpc: '2.0',
    // TODO: Generate a unique request id
    id: 1,
    method,
    params,
  }
  console.log(`JSONRPC request ${JSON.stringify(request, null, 2)}`)

  return axios
    .post(url, request)
    .then((response) => {
      console.log(`JSONRPC response ${JSON.stringify(response, null, 2)}`)
      if (response.data.error) {
        console.error(`JSONRPC error: ${JSON.stringify(response.data.error)}`)
        throw response.data.error
      } else {
        return response.data.result
      }
    })
}

export const rpcURIs = {
    future: 'https://rpc-futurenet.stellar.org',
    local: 'http://localhost:8000/soroban/rpc',
  }

class SorobanServer {
  serverURL

  constructor(networkType) {
    this.serverURL = rpcURIs[networkType]
    if (!this.serverURL) {
        throw Error(`network ${networkType} does not yet have soroban support`)
    }
  }

  getLedgerEntry(key) {
    return post(this.serverURL.toString(), 'getLedgerEntries', [
      key.toXDR('base64'),
    ]).then(result=>result.entries[0])
  }
}

export default SorobanServer
