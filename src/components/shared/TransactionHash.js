import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {shortHash} from '../../lib/utils'

const TransactionHash = ({hash, compact = true}) => {
  const hashLabel = compact ? shortHash(hash) : hash
  const className = !compact ? 'monospace' : ''
  return (
    <span title={hash} className={className}>
      <Link to={`/tx/${hash}`}>{hashLabel}</Link>
    </span>
  )
}
TransactionHash.propTypes = {
  hash: PropTypes.string.isRequired,
  compact: PropTypes.bool,
}

export default TransactionHash
