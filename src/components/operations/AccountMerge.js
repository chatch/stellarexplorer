import React from 'react'
import AccountLink from '../shared/AccountLink'

const AccountMerge = ({into}) =>
  <span>{'Into: '} <AccountLink account={into} /></span>

export default AccountMerge
