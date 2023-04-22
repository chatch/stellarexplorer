const networks = {
  public: 'public',
  test: 'test',
  local: 'local',
  future: 'future',
}

const hostnameToNetworkType = (hostname) => {
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
  } else return networks.local
}

export {networks as default, hostnameToNetworkType}
