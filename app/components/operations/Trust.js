import React from 'react'
import AccountLink from '../shared/AccountLink'
import {FormattedMessage} from 'react-intl'

const Trust = ({assetCode, children, trustee}) =>
  <span>
    <FormattedMessage
      id="operation.trust"
      values={{
        assetCode: assetCode,
        trustee: <AccountLink account={trustee} />,
      }}
    />
    {children}
  </span>

export default Trust
