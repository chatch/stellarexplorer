import { Link } from 'react-router-dom'
import has from 'lodash/has'
import { MuxedAccount } from '../../lib/stellar/sdk'

import knownAccounts from '../../data/known_accounts'
import { isContractAddress, isMuxedAddress } from '../../lib/stellar/utils'
import { shortAddress } from '../../lib/utils'
import React from 'react'

interface AccountLinkSimpleProps {
  title: string
  subPath: string
  label: React.JSX.Element
  type?: string
}

const AccountLinkSimple = ({
  title,
  subPath,
  label,
  type,
}: AccountLinkSimpleProps) => (
  <span title={title}>
    <Link to={`/${type}/${subPath}`}>{label}</Link>
  </span>
)

interface BaseAccountLinkProps {
  type?: string
  address: string
  label: string
  hideKnown: boolean
}

const BaseAccountLink = ({
  type = 'account',
  address,
  label,
  hideKnown,
}: BaseAccountLinkProps) => {
  let accLabel
  if (label) {
    accLabel = label
  } else if (has(knownAccounts, address) && !hideKnown) {
    accLabel = (
      <span style={{ fontStyle: 'italic' }}>{knownAccounts[address].name}</span>
    )
  } else {
    accLabel = shortAddress(address)
  }
  return (
    <AccountLinkSimple
      type={type}
      title={`Base Address: ${address}`}
      subPath={address}
      label={accLabel}
    />
  )
}

const MuxedAccountLink = ({ address }: { address: string }) => {
  const muxedAccount = MuxedAccount.fromAddress(address, '1')
  // TODO: baseACcount here: correct?
  const publicAddress = muxedAccount.baseAccount().accountId()
  const muxedAddress = muxedAccount.accountId()
  const labelRendered = (
    <span>
      {shortAddress(muxedAddress)}
      <span style={{ fontSize: 'smaller' }}>
        {` [${shortAddress(publicAddress)}]`}
      </span>
    </span>
  )
  return (
    <AccountLinkSimple
      title={`Muxed Address: ${muxedAddress}`}
      subPath={muxedAddress}
      label={labelRendered}
    />
  )
}

interface AccountLinkProps {
  account: string
  hideKnown?: boolean
  label?: string
}

const AccountLink = ({
  account,
  label,
  hideKnown = false,
}: AccountLinkProps) => {
  if (isMuxedAddress(account)) {
    return <MuxedAccountLink address={account} />
  } else if (isContractAddress(account)) {
    return (
      <BaseAccountLink
        type="contract"
        address={account}
        label={label ?? ''}
        hideKnown={hideKnown}
      />
    )
  } else {
    return (
      <BaseAccountLink
        address={account}
        label={label ?? ''}
        hideKnown={hideKnown}
      />
    )
  }
}

export { AccountLink as default, BaseAccountLink, MuxedAccountLink }
