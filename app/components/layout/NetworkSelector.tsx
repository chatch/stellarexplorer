import { networks } from '../../lib/stellar'
import CustomNetworkButton from '../shared/CustomNetworkButton'
import type { NetworkKey } from '~/lib/stellar/networks'

const HOME_PUBLIC = 'https://steexp.com'
const HOME_TESTNET = 'https://testnet.steexp.com'
const HOME_FUTURENET = 'https://futurenet.steexp.com'

const redirectToNetworkAddressFn =
  (storage: Storage) => (networkAddress: string, href: string) => {
    console.log(`NETWORK change: to ${networkAddress}`)
    storage.setItem('networkAddress', networkAddress)
    if (!href) href = window.location.origin
    window.location.href = href
  }

// network switcher buttons in the header
const redirectToNetworkType = (
  networkType: string,
  networkIsLocal: boolean,
) => {
  let href = HOME_PUBLIC
  if (networkIsLocal) {
    href = `http://${networkType}net.local:3000`
  } else if (networkType === networks.test) {
    href = HOME_TESTNET
  } else if (networkType === networks.future) {
    href = HOME_FUTURENET
  }
  window.location.href = href
}

interface NetworkButtonProps {
  networkType: string
  networkIsLocal: boolean
  selectedNetworkType: string
}

const NetworkButton = ({
  networkType,
  selectedNetworkType,
  networkIsLocal,
}: NetworkButtonProps) => (
  <button
    className={
      networkType === selectedNetworkType ? 'is-active' : 'is-inactive'
    }
    onClick={(e) => redirectToNetworkType(networkType, networkIsLocal)}
  >
    {networkType.toUpperCase()}
  </button>
)

interface NetworkSelectorProps {
  networkType: NetworkKey
  networkIsLocal: boolean
  // networkAddress: string
  // selectedNetworkType?: string
  // setNetworkAddress: Function
}

const NetworkSelector = (props: NetworkSelectorProps) => (
  <div className="network-selector">
    {[networks.public, networks.test, networks.future].map((networkType) => (
      <NetworkButton
        key={networkType}
        networkType={networkType}
        selectedNetworkType={props.networkType}
        networkIsLocal={props.networkIsLocal}
      />
    ))}
    {/* <CustomNetworkButton
      key="custom-network"
      networkAddress={props.networkAddress}
      networkType={props.networkType}
      setNetworkAddress={props.setNetworkAddress}
    /> */}
  </div>
)

export default NetworkSelector
