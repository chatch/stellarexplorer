import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import knownAccounts from '../../data/known_accounts'

const AccountLink = ({account, label}) => {
  let accLabel = label
  if (!accLabel) {
    accLabel = knownAccounts.hasOwnProperty(account)
      ? <span style={{fontStyle: 'italic'}}>
          {knownAccounts[account].name}
        </span>
      : account.substring(0, 4)
  }
  return (
    <span title={account}>
      <Link to={`/account/${account}`}>
        {accLabel}
      </Link>
    </span>
  )
}

AccountLink.propTypes = {
  account: PropTypes.string.isRequired,
  label: PropTypes.string,
}

export default AccountLink
