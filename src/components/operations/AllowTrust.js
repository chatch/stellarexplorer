import React from 'react'
import {FormattedMessage} from 'react-intl'
import AccountLink from '../shared/AccountLink'
import Trust from './Trust'

const AllowTrust = props => (
  <Trust {...props}>
    <FormattedMessage
      id="operation.trust.allow"
      values={{
        authorize: String(props.authorize),
        trustor: <AccountLink account={props.trustor} />,
      }}
    />
  </Trust>
)

export default AllowTrust
