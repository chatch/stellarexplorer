import { getSession } from '~/sessions'
import { isValidUrl } from '../utils'

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
  isCustom: boolean
  customHorizonAddress: string
  customSorobanRPCAddress: string
}

const urlParamOrSessionOrEmpty = (
  prop: string,
  url: URL,
  session: any,
): string => url.searchParams.get(prop) ?? session.get(prop) ?? ''

const requestToNetworkDetails = async (
  request: Request,
): Promise<NetworkDetails> => {
  const session = await getSession(request.headers.get('Cookie'))
  const url = new URL(request.url)

  const customHorizonAddress = urlParamOrSessionOrEmpty(
    'horizonAddress',
    url,
    session,
  )
  const customSorobanRPCAddress = urlParamOrSessionOrEmpty(
    'sorobanRPCAddress',
    url,
    session,
  )

  return {
    networkType: hostnameToNetworkType(url.hostname),
    isLocal: url.hostname.endsWith('.local'),
    isCustom:
      isValidUrl(customHorizonAddress) && isValidUrl(customSorobanRPCAddress),
    customHorizonAddress,
    customSorobanRPCAddress,
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
    hostname === 'futurenet.local'
  ) {
    return networks.future
  } else {
    return networks.local
  }
}

export type { NetworkDetails }

export { networks as default, hostnameToNetworkType, requestToNetworkDetails }
