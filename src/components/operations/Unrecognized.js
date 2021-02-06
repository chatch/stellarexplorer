import React from 'react'
import {FormattedMessage} from 'react-intl'

const Unrecognized = ({type}) => <FormattedMessage
  id="operation.unrecognized"
  values={{
    type: type,
  }}
/>

export default Unrecognized
