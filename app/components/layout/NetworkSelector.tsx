import { networks } from '~/lib/stellar'
import type { NetworkDetails } from '~/lib/stellar/networks'
import CustomNetworkButton from '../shared/CustomNetworkButton'

const HOME_PUBLIC = 'https://steexp.com'
const HOME_TESTNET = 'https://testnet.steexp.com'
const HOME_FUTURENET = 'https://futurenet.steexp.com'

const networkTypeToRedirectAddress = (
  networkType: string,
  isLocal: boolean,
): string => {
  let href = HOME_PUBLIC
  if (isLocal) {
    href = `http://${networkType}net.local:3000`
  } else if (networkType === networks.test) {
    href = HOME_TESTNET
  } else if (networkType === networks.future) {
    href = HOME_FUTURENET
  }
  return href
}

interface NetworkButtonProps {
  networkType: string
  selectedNetworkType: string
}

const NetworkButton = ({
  networkType,
  selectedNetworkType,
}: NetworkButtonProps) => (
  <button
    className={
      networkType === selectedNetworkType ? 'is-active' : 'is-inactive'
    }
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
      <form
        key={btnNetType}
        method="POST"
        action={`/settings?redirect_to=${networkTypeToRedirectAddress(
          btnNetType,
          isLocal,
        )}`}
      >
        <NetworkButton
          key={btnNetType}
          networkType={btnNetType}
          selectedNetworkType={isCustom ? 'custom' : networkType}
        />
      </form>
    ))}
    <CustomNetworkButton
      key="custom-network"
      customHorizonAddress={customHorizonAddress}
      customSorobanRPCAddress={customSorobanRPCAddress}
    />
  </div>
)

export default NetworkSelector
