import React from 'react'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'
import Asset from '../shared/Asset'

const offerType = (amount, offerId) => {
  let type = ''
  if (offerId === 0) type = 'sell'
  else if (parseFloat(amount) === 0) type = 'remove'
  else type = 'update'
  return type
}

const Offer = ({
  amount,
  buyingAssetCode,
  buyingAssetIssuer,
  buyingAssetType,
  offerId,
  price,
  sellingAssetCode,
  sellingAssetIssuer,
  sellingAssetType,
}) => {
  const msgId = `operation.offer.${offerType(amount, offerId)}`
  return (
    <FormattedMessage
      id={msgId}
      values={{
        amount: amount,
        buyingAsset: (
          <Asset
            code={buyingAssetCode}
            issuer={buyingAssetIssuer}
            type={buyingAssetType}
          />
        ),
        price: price,
        sellingAsset: (
          <Asset
            code={sellingAssetCode}
            issuer={sellingAssetIssuer}
            type={sellingAssetType}
          />
        ),
      }}
    />
  )
}

Offer.propTypes = {
  amount: PropTypes.string,
  buyingAssetCode: PropTypes.string,
  buyingAssetIssuer: PropTypes.string,
  buyingAssetType: PropTypes.string.isRequired,
  offerId: PropTypes.number.isRequired,
  price: PropTypes.string.isRequired,
  sellingAssetCode: PropTypes.string,
  sellingAssetIssuer: PropTypes.string,
  sellingAssetType: PropTypes.string.isRequired,
}

export default Offer
