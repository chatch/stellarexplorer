import React from 'react'
// @ts-expect-error - prop-types has incomplete type declarations
import PropTypes from 'prop-types'
import { Link } from '@remix-run/react'
import { shortHash } from '../../lib/utils'

const TransactionHash = ({
  hash,
  compact = true,
}: {
  hash: string
  compact: boolean
}) => {
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
