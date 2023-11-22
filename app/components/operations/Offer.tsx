import { FormattedMessage } from 'react-intl'

import AccountLink from '../shared/AccountLink'
import Asset from '../shared/Asset'
import FormattedAmount from '../shared/FormattedAmount'

interface OfferProps {
  id: string
  amount: string
  buyingAssetCode: string
  buyingAssetIssuer: string
  buyingAssetType: string
  offerId: number
  price: string
  seller: string
  sellingAssetCode: string
  sellingAssetIssuer: string
  sellingAssetType: string
  showSeller: boolean
}
const BuyingAsset = ({
  buyingAssetCode,
  buyingAssetIssuer,
  buyingAssetType,
}: Partial<OfferProps>) => (
  <Asset
    code={buyingAssetCode as string}
    issuer={buyingAssetIssuer as string}
    type={buyingAssetType as string}
  />
)

const SellingAsset = ({
  sellingAssetCode,
  sellingAssetIssuer,
  sellingAssetType,
}: Partial<OfferProps>) => (
  <Asset
    code={sellingAssetCode as string}
    issuer={sellingAssetIssuer as string}
    type={sellingAssetType as string}
  />
)

const offerType = (amount: string, offerId: number) => {
  let type = ''
  if (offerId === 0) type = 'sell'
  else if (parseFloat(amount) === 0) type = 'remove'
  else type = 'update'
  return type
}

const Offer = (props: Partial<OfferProps>) => {
  const { amount, offerId, price } = props
  const msgId = `operation.offer.${offerType(
    amount as string,
    offerId as number,
  )}`
  return (
    <FormattedMessage
      id={msgId}
      values={{
        amount: <FormattedAmount amount={amount as string} />,
        buyingAsset: <BuyingAsset {...props} />,
        price: <FormattedAmount amount={price as string} />,
        sellingAsset: <SellingAsset {...props} />,
      }}
    />
  )
}

const OfferRow = (props: OfferProps) => (
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

export { Offer as default, OfferRow }
