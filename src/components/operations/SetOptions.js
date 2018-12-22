import React from 'react'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'
import {StrKey} from 'stellar-sdk'
import AccountLink from '../shared/AccountLink'
import snakeCase from 'lodash/snakeCase'
import {isPublicKey} from '../../lib/stellar/utils'
import {shortHash} from '../../lib/utils'

const propTypes = {
  homeDomain: PropTypes.string,
  signerKey: PropTypes.string,
  signerWeight: PropTypes.number,
  masterKeyWeight: PropTypes.number,
  inflationDest: PropTypes.string,
  setFlagsS: PropTypes.array,
  clearFlagsS: PropTypes.array,
  lowThreshold: PropTypes.number,
  medThreshold: PropTypes.number,
  highThreshold: PropTypes.number,
}

const dotCase = str => snakeCase(str).replace('_', '.')

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

const OptionValue = ({optKey, value}) => {
  let valueEl = value
  if (value instanceof Array) valueEl = value.join(', ')
  else if (
    (optKey === 'signerKey' && isPublicKey(value)) ||
    optKey === 'inflationDest'
  ) {
    valueEl = <AccountLink account={value} />
  } else if (optKey === 'signerKey') {
    // and !isPublicKey (#19)
    const decodedValue =
      value.charAt(0) === 'X'
        ? StrKey.decodeSha256Hash(value).toString('hex')
        : StrKey.decodePreAuthTx(value).toString('hex')
    valueEl = <span title={decodedValue}>{shortHash(decodedValue)}</span>
  } else if (optKey === 'homeDomain') {
    valueEl = <a href={`http://${value}`}>{value}</a>
  }
  return <span>{valueEl}</span>
}

const OptionsList = props => (
  <span>
    {Object.keys(props)
      .filter(p => p in propTypes)
      .map((prop, idx, all) => (
        <span key={prop}>
          <Option
            msgId={dotCase(prop)}
            value={<OptionValue optKey={prop} value={props[prop]} />}
          />
          {idx < all.length - 1 && ', '}
        </span>
      ))}
  </span>
)

const SetOptions = props => (
  <FormattedMessage
    id="operation.options.set"
    values={{
      options: <OptionsList {...props} />,
    }}
  />
)

SetOptions.propTypes = propTypes

export default SetOptions
