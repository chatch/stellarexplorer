import networks, {hostnameToNetwork} from '../networks'

describe('hostnameToNetwork', () => {
  it('detects network correctly from the hostname', () => {
    // public network
    expect(hostnameToNetwork('steexp.com')).toEqual(networks.public)

    // test network
    expect(hostnameToNetwork('testnet.steexp.com')).toEqual(networks.test)

    // localhost for development
    expect(hostnameToNetwork('localnet.local')).toEqual(networks.local)
    expect(hostnameToNetwork('testnet.local')).toEqual(networks.test)
    expect(hostnameToNetwork('publicnet.local')).toEqual(networks.public)

    // unknown hosts default to local
    expect(hostnameToNetwork()).toEqual(networks.local)
    expect(hostnameToNetwork('')).toEqual(networks.local)
    expect(hostnameToNetwork('localhost')).toEqual(networks.local)
    expect(hostnameToNetwork('0.0.0.0')).toEqual(networks.local)
    expect(hostnameToNetwork('not.steexp.com')).toEqual(networks.local)
  })
})
