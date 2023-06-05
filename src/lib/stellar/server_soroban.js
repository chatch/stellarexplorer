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

class SorobanServer {
  serverURL

  constructor(serverBaseURI) {
    this.serverURL = `${serverBaseURI}/soroban/rpc`
  }

  getLedgerEntry(key) {
    return post(this.serverURL.toString(), 'getLedgerEntries', [
      key.toXDR('base64'),
    ]).then(result=>result.entries[0])
  }
}

export default SorobanServer
