import React from 'react'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'

import AccountLink from '../shared/AccountLink'
import Asset from '../shared/Asset'
import FormattedAmount from '../shared/FormattedAmount'

const BuyingAsset = ({buyingAssetCode, buyingAssetIssuer, buyingAssetType}) => (
  <Asset
    code={buyingAssetCode}
    issuer={buyingAssetIssuer}
    type={buyingAssetType}
  />
)

const SellingAsset = ({
  sellingAssetCode,
  sellingAssetIssuer,
  sellingAssetType,
}) => (
  <Asset
    code={sellingAssetCode}
    issuer={sellingAssetIssuer}
    type={sellingAssetType}
  />
)

const offerType = (amount, offerId) => {
  let type = ''
  if (offerId === 0) type = 'sell'
  else if (parseFloat(amount) === 0) type = 'remove'
  else type = 'update'
  return type
}

const Offer = props => {
  const {amount, offerId, price} = props
  const msgId = `operation.offer.${offerType(amount, offerId)}`
  return (
    <FormattedMessage
      id={msgId}
      values={{
        amount: <FormattedAmount amount={amount} />,
        buyingAsset: <BuyingAsset {...props} />,
        price: <FormattedAmount amount={price} />,
        sellingAsset: <SellingAsset {...props} />,
      }}
    />
  )
}

const OfferRow = props => (
  <tr key={props.id} className="trade">
    {props.showSeller === true && (
      <td className="account-badge">
        <AccountLink account={props.seller} />
      </td>
    )}
    <td>
      <SellingAsset {...props} />
    </td>
    <td>
      <BuyingAsset {...props} />
    </td>
    <td>{props.amount}</td>
    <td>{props.price}</td>
  </tr>
)

Offer.propTypes = {
  amount: PropTypes.string,
  buyingAssetCode: PropTypes.string,
  buyingAssetIssuer: PropTypes.string,
  buyingAssetType: PropTypes.string.isRequired,
  offerId: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  seller: PropTypes.string,
  sellingAssetCode: PropTypes.string,
  sellingAssetIssuer: PropTypes.string,
  sellingAssetType: PropTypes.string.isRequired,
  showSeller: PropTypes.bool,
}

export {Offer as default, OfferRow}
