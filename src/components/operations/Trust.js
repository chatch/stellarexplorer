import React from 'react'
import AccountLink from '../shared/AccountLink'

const Trust = ({assetCode, children, trustee}) =>
  <span>
    Trust <AccountLink account={trustee} /> issuing {assetCode}
    {children}
  </span>

export default Trust
