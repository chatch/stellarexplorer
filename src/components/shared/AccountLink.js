import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import has from 'lodash/has'
import {MuxedAccount} from 'stellar-sdk'

import {shortAddress} from '../../lib/utils'
import knownAccounts from '../../data/known_accounts'

const AccountLinkSimple = ({title, subPath, label}) => (
  <span title={title}>
    <Link to={`/account/${subPath}`}>{label}</Link>
  </span>
)

const BaseAccountLink = ({address, label, hideKnown}) => {
  let accLabel
  if (label) {
    accLabel = label
  } else if (has(knownAccounts, address) && !hideKnown) {
    accLabel = <span style={{fontStyle: 'italic'}}>{knownAccounts[address].name}</span>
  } else {
    accLabel = shortAddress(address)
  }
  return (
    <AccountLinkSimple title={address} subPath={address} label={accLabel} />
  )
}

const MuxedAccountLink = ({address, label, hideKnown}) => {
  const muxedAccount = MuxedAccount.fromAddress(address, '1')
  const publicAddress = muxedAccount.account.accountId()
  const muxedAddress = muxedAccount.accountId()
  return (
    <span>
      <AccountLinkSimple 
        title={muxedAddress}
        subPath={`${publicAddress}?muxed=${muxedAddress}`}
        label={shortAddress(muxedAddress)}
      />&nbsp;(
        <BaseAccountLink 
          address={publicAddress}
          label={label}
          hideKnown={hideKnown}
        />
      )
    </span>
  )
}

const AccountLink = ({account, label, hideKnown = false}) => {
  const isMuxedAccount = account.startsWith('M')
  if  (isMuxedAccount) {
    return (
      <MuxedAccountLink 
        address={account}
        label={label}
        hideKnown={hideKnown}
      />
    )
  } else  {
    return (
      <BaseAccountLink
        address={account}
        label={label}
        hideKnown={hideKnown}
      />
    )
  }
}

AccountLink.propTypes = {
  account: PropTypes.string.isRequired,
  hideKnown: PropTypes.bool,
  label: PropTypes.string,
}

export default AccountLink
