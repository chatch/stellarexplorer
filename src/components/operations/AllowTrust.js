import React from 'react'
import Trust from './Trust'
import {FormattedMessage} from 'react-intl'

const AllowTrust = props => (
  <Trust {...props}>
    <FormattedMessage
      id="operation.trust.allow"
      values={{
        authorize: String(props.authorize),
      }}
    />
  </Trust>
)

export default AllowTrust
