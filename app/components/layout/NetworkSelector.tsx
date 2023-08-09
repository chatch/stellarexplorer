import { networks } from '../../lib/stellar'
import CustomNetworkButton from '../shared/CustomNetworkButton'
import { NetworkKey } from '~/lib/stellar/networks'

interface NetworkButtonProps {
  networkType: string
  selectedNetworkType: string
  switchNetworkType: Function
}

const NetworkButton = ({ networkType, selectedNetworkType, switchNetworkType }: NetworkButtonProps) =>
  <button
    className={networkType === selectedNetworkType ? 'is-active' : 'is-inactive'}
    onClick={e => switchNetworkType(networkType)}
  >
    {networkType.toUpperCase()}
  </button>

interface NetworkSelectorProps {
  networkType: NetworkKey
  networkAddress: string
  selectedNetworkType?: string
  switchNetworkType: Function
  setNetworkAddress: Function
}

const NetworkSelector = (props: NetworkSelectorProps) =>
  <div className="network-selector">
    {[networks.public, networks.test, networks.future].map(networkType =>
      <NetworkButton
        key={networkType}
        networkType={networkType}
        selectedNetworkType={props.networkType}
        switchNetworkType={props.switchNetworkType}
      />
    )}
    <CustomNetworkButton
      key="custom-network"
      networkAddress={props.networkAddress}
      networkType={props.networkType}
      setNetworkAddress={props.setNetworkAddress}
    />
  </div>

export default NetworkSelector
