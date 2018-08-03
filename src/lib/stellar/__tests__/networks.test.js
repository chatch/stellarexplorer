import networks, {hostnameToNetworkType} from '../networks'

describe('hostnameToNetwork', () => {
  it('detects network type correctly from the hostname', () => {
    // public network
    expect(hostnameToNetworkType('steexp.com')).toEqual(networks.public)

    // test network
    expect(hostnameToNetworkType('testnet.steexp.com')).toEqual(networks.test)

    // localhost for development
    expect(hostnameToNetworkType('localnet.local')).toEqual(networks.local)
    expect(hostnameToNetworkType('testnet.local')).toEqual(networks.test)
    expect(hostnameToNetworkType('publicnet.local')).toEqual(networks.public)

    // unknown hosts default to local
    expect(hostnameToNetworkType()).toEqual(networks.local)
    expect(hostnameToNetworkType('')).toEqual(networks.local)
    expect(hostnameToNetworkType('localhost')).toEqual(networks.local)
    expect(hostnameToNetworkType('0.0.0.0')).toEqual(networks.local)
    expect(hostnameToNetworkType('not.steexp.com')).toEqual(networks.local)
  })
})
