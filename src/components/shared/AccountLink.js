import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

const AccountLink = ({account, label}) =>
  <span title={account}>
    <Link to={`/account/${account}`}>
      {label ? label : account.substring(0, 4)}
    </Link>
  </span>

AccountLink.propTypes = {
  account: PropTypes.string.isRequired,
  label: PropTypes.string,
}

export default AccountLink
