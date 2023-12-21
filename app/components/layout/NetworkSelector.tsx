import { networks } from '~/lib/stellar'
import type { NetworkDetails } from '~/lib/stellar/networks'
import CustomNetworkButton from '../shared/CustomNetworkButton'

const HOME_PUBLIC = 'https://steexp.com'
const HOME_TESTNET = 'https://testnet.steexp.com'
const HOME_FUTURENET = 'https://futurenet.steexp.com'

// network switcher buttons in the header
const redirectToNetworkType = (networkType: string, isLocal: boolean) => {
  let href = HOME_PUBLIC
  if (isLocal) {
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
  isLocal: boolean
  selectedNetworkType: string
}

const NetworkButton = ({
  networkType,
  selectedNetworkType,
  isLocal,
}: NetworkButtonProps) => (
  <button
    className={
      networkType === selectedNetworkType ? 'is-active' : 'is-inactive'
    }
    onClick={(e) => redirectToNetworkType(networkType, isLocal)}
  >
    {networkType.toUpperCase()}
  </button>
)

type NetworkSelectorProps = NetworkDetails

const NetworkSelector = ({
  networkType,
  isLocal,
  isCustom,
  customHorizonAddress,
  customSorobanRPCAddress,
}: Readonly<NetworkSelectorProps>) => (
  <div className="network-selector">
    {[networks.public, networks.test, networks.future].map((btnNetType) => (
      <NetworkButton
        key={btnNetType}
        networkType={btnNetType}
        selectedNetworkType={isCustom ? 'custom' : networkType}
        isLocal={isLocal}
      />
    ))}
    <CustomNetworkButton
      key="custom-network"
      customHorizonAddress={customHorizonAddress}
      customSorobanRPCAddress={customSorobanRPCAddress}
    />
  </div>
)

export default NetworkSelector
