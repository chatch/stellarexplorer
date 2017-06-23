import React from 'react'
import PropTypes from 'prop-types'
import Asset from '../shared/Asset'
import AccountLink from '../shared/AccountLink'

const Payment = ({amount, assetCode, assetIssuer, assetType, children, to}) =>
  <span>
    Pay {amount}{' '}
    <Asset code={assetCode} issuer={assetIssuer} type={assetType} />{' '}
    to <AccountLink account={to} />
    {children}
  </span>

Payment.propTypes = {
  amount: PropTypes.string.isRequired,
  assetCode: PropTypes.string,
  assetIssuer: PropTypes.string,
  assetType: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

export default Payment
