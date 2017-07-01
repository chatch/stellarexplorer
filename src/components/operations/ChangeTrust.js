import React from 'react'
import Trust from './Trust'
import {FormattedMessage} from 'react-intl'

const ChangeTrust = props =>
  <Trust {...props}>
    <FormattedMessage
      id="operation.trust.change"
      values={{
        limit: props.limit,
      }}
    />
  </Trust>

export default ChangeTrust
