import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import has from 'lodash/has'

import knownAccounts from '../../data/known_accounts'

const AccountLink = ({account, label, hideKnown = false}) => {
  if (!account || account == null) return null
  let accLabel = label
  if (!accLabel) {
    accLabel =
      has(knownAccounts, account) && !hideKnown ? (
        <span style={{fontStyle: 'italic'}}>{knownAccounts[account].name}</span>
      ) : (
        account.substring(0, 4)
      )
  }
  return (
    <span title={account}>
      <Link to={`/account/${account}`}>{accLabel}</Link>
    </span>
  )
}

AccountLink.propTypes = {
  account: PropTypes.string.isRequired,
  hideKnown: PropTypes.bool,
  label: PropTypes.string,
}

export default AccountLink
