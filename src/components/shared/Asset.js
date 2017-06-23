import React from 'react'
import PropTypes from 'prop-types'
import AccountLink from './AccountLink'

const Asset = ({code, issuer, type}) => {
  const isLumens = type === 'native'
  const propCode = isLumens ? 'XLM' : code
  return (
    <span>
      {propCode}{' '}
      {!isLumens &&
        <small>
          [<AccountLink label="issuer" account={issuer} />]
        </small>}
    </span>
  )
}

// For XLM code and issuer aren't set. type will be 'native'
Asset.propTypes = {
  code: PropTypes.string,
  issuer: PropTypes.string,
  type: PropTypes.string.isRequired,
}

export default Asset
