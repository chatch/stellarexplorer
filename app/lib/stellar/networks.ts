export type NetworkKey = 'public' | 'test' | 'local' | 'future'

const networks: Record<NetworkKey, NetworkKey> = {
  public: 'public',
  test: 'test',
  local: 'local',
  future: 'future',
}

interface NetworkDetails {
  networkType: NetworkKey
  isLocal: boolean
}

const requestToNetworkDetails = (request: Request): NetworkDetails => {
  const url = new URL(`http://${request.headers.get('host')}`)
  return {
    networkType: hostnameToNetworkType(url.hostname),
    isLocal: url.hostname.endsWith('.local'),
  }
}

const hostnameToNetworkType = (hostname: string) => {
  if (hostname === 'steexp.com' || hostname === 'publicnet.local') {
    return networks.public
  } else if (
    hostname === 'testnet.steexp.com' ||
    hostname === 'testnet.local'
  ) {
    return networks.test
  } else if (
    hostname === 'futurenet.steexp.com' ||
    hostname === 'futurenet.local' ||
    hostname === 'steexp-v2-beta.fly.dev'
  ) {
    return networks.future
  } else {
    return networks.local
  }
}

export { networks as default, hostnameToNetworkType, requestToNetworkDetails }
