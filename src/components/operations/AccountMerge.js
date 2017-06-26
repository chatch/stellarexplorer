import React from 'react'
import AccountLink from '../shared/AccountLink'

const AccountMerge = ({into}) =>
  <span>Account merged into{' '}<AccountLink account={into} /></span>

export default AccountMerge
