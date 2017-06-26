import React from 'react'
import PropTypes from 'prop-types'
import Asset from '../shared/Asset'

const offerTypeDesc = (amount, offerId) => {
  let desc = ''
  if (offerId === 0) desc += `Sell Offer: ${amount} `
  else if (parseFloat(amount) === 0) desc += `Remove Offer: `
  else desc += `Update Offer: ${amount} `
  return desc
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
}) =>
  <span>
    {offerTypeDesc(amount, offerId)}
    <Asset
      code={sellingAssetCode}
      issuer={sellingAssetIssuer}
      type={sellingAssetType}
    />
    {` for `}
    <Asset
      code={buyingAssetCode}
      issuer={buyingAssetIssuer}
      type={buyingAssetType}
    />
    {` @ ${price}`}
  </span>

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
