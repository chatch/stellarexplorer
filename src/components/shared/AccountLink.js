import React from 'react'
import {Link} from 'react-router-dom'

const AccountLink = props =>
  <span title={props.account}>
    <Link to={`/account/${props.account}`}>
      {props.label ? props.label : props.account.substring(0, 4)}
    </Link>
  </span>

export default AccountLink
