import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import anchors from '../../lib/anchors'

const AccountLink = ({account, label}) => {
  let accLabel = label
  if (!accLabel) {
    accLabel = anchors.hasOwnProperty(account)
      ? <span style={{fontStyle: 'italic'}}>
          {anchors[account].name}
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
