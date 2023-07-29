import React from 'react'
import AccountLink from '../shared/AccountLink'
import {FormattedMessage} from 'react-intl'

const AccountMerge = ({into}) =>
  <FormattedMessage
    id="operation.account.merge"
    values={{
      account: <AccountLink account={into} />,
    }}
  />

export default AccountMerge
