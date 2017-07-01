import React from 'react'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'
import AccountLink from '../shared/AccountLink'
import _ from 'lodash'

const propTypes = {
  homeDomain: PropTypes.string,
  signerKey: PropTypes.string,
  signerWeight: PropTypes.string,
  masterKeyWeight: PropTypes.string,
  inflationDest: PropTypes.string,
  setFlagsS: PropTypes.array,
  clearFlagsS: PropTypes.array,
  lowThreshold: PropTypes.number,
  medThreshold: PropTypes.number,
  highThreshold: PropTypes.number,
}

const dotCase = str => _.snakeCase(str).replace('_', '.')

const Option = ({msgId, value}) => {
  return (
    <FormattedMessage
      id={`operation.options.set.${msgId}`}
      values={{
        value: value,
      }}
    />
  )
}

const OptionValue = ({optKey, value, type}) =>
  <span>
    {type === PropTypes.array
      ? value.join(', ')
      : optKey === 'inflationDest' ? <AccountLink account={value} /> : value}
  </span>

const OptionsList = props =>
  <span>
    {Object.keys(props).filter(p => p in propTypes).map((prop, idx, all) =>
      <span key={prop}>
        <Option
          msgId={dotCase(prop)}
          value={
            <OptionValue
              optKey={prop}
              value={props[prop]}
              type={propTypes[prop]}
            />
          }
        />
        {idx < all.length - 1 && ', '}
      </span>
    )}
  </span>

const SetOptions = props =>
  <FormattedMessage
    id="operation.options.set"
    values={{
      options: <OptionsList {...props} />,
    }}
  />

SetOptions.propTypes = propTypes

export default SetOptions
