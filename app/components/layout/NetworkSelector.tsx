import { networks } from '~/lib/stellar'
import type { NetworkDetails } from '~/lib/stellar/networks'
import CustomNetworkButton from '../shared/CustomNetworkButton'
import Cookies from 'js-cookie'

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
      <button
        key={btnNetType}
        className={
          isCustom
            ? 'is-inactive'
            : btnNetType === networkType
              ? 'is-active'
              : 'is-inactive'
        }
        onClick={(e) => {
          e.preventDefault()
          // Clear custom network settings
          Cookies.remove('horizonAddress')
          Cookies.remove('sorobanRPCAddress')

          if (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1'
          ) {
            Cookies.set('network', btnNetType)
            window.location.reload()
            return
          }

          const target = networkTypeToRedirectAddress(btnNetType, isLocal)
          console.log(`Switching to ${btnNetType}: ${target}`)
          window.location.href = target
        }}
      >
        {btnNetType.toUpperCase()}
      </button>
    ))}
    <CustomNetworkButton
      key="custom-network"
      customHorizonAddress={customHorizonAddress}
      customSorobanRPCAddress={customSorobanRPCAddress}
    />
  </div>
)

export default NetworkSelector
