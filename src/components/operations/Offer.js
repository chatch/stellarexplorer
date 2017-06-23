import React from 'react'
import PropTypes from 'prop-types'
import Asset from '../shared/Asset'

const offerTypeString = (amount, offerId) =>
  offerId === 0 ? 'Sell' : amount === 0 ? 'Remove offer' : 'Update offer'

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
    {`${offerTypeString(amount, offerId)} ${amount} `}
    {console.log(sellingAssetType)}
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
  buyingAssetIssuer: PropTypes.string.isRequired,
  buyingAssetType: PropTypes.string.isRequired,
  offerId: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  sellingAssetCode: PropTypes.string,
  sellingAssetIssuer: PropTypes.string.isRequired,
  sellingAssetType: PropTypes.string.isRequired,
}

export default Offer
