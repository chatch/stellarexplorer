import React from 'react'
import {FormattedMessage} from 'react-intl'

const BumpSequence = props => (
  <FormattedMessage
    id="operation.bump"
    values={{
      sequence: String(props.bumpTo),
    }}
  />
)

export default BumpSequence
