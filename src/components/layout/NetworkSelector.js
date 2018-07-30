import React from 'react'
import {networks} from '../../lib/stellar'
import CustomNetworkButton from '../shared/CustomNetworkButton'

const NetworkButton = ({networkType, selectedNetworkType, switchNetworkType}) =>
  <button
    className={networkType === selectedNetworkType ? 'is-active' : 'is-inactive'}
    onClick={e => switchNetworkType(networkType)}
  >
    {networkType.toUpperCase()}
  </button>

const NetworkSelector = props =>
  <div className="Network-Selector">
    {[networks.public, networks.test].map(networkType =>
      <NetworkButton
        key={networkType}
        hide={networks[networkType].hide}
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
