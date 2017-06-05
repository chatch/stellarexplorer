import React from 'react'
import {Link} from 'react-router-dom'

const AccountLink = (props) => <Link to={`/account/${props.account}`}>
  {props.label
    ? props.label
    : props.account}
</Link>

export default AccountLink
