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
  isLocal: boolean
}

const NetworkButton = ({
  networkType,
  selectedNetworkType,
  isLocal,
}: NetworkButtonProps) => (
  <button
    type="submit"
    name={`btn-${networkType}`}
    onClick={() => {
      if (document.getElementById('redirect_to')) {
        ;(document.getElementById('redirect_to') as HTMLFormElement).value =
          networkTypeToRedirectAddress(networkType, isLocal)
      }
    }}
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
    <form method="POST" action="/settings?unset=true">
      <input type="hidden" id="redirect_to" name="redirect_to" />
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
    </form>
  </div>
)

export default NetworkSelector
