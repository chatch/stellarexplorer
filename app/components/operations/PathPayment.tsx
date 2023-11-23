import React from 'react'
import type { PaymentProps } from './Payment'
import Payment from './Payment'
import Asset from '../shared/Asset'
import { FormattedMessage } from 'react-intl'

export interface PathPaymentProps extends PaymentProps {
  sourceAssetCode: string
  sourceAssetIssuer: string
  sourceAssetType: string
  sourceAmount: string
}

const PathPayment = (props: PathPaymentProps) => {
  const sourceAsset = (
    <Asset
      code={props.sourceAssetCode}
      issuer={props.sourceAssetIssuer}
      type={props.sourceAssetType}
    />
  )
  return (
    <Payment {...props}>
      <FormattedMessage
        id="operation.payment.path"
        values={{
          amount: props.sourceAmount,
          asset: sourceAsset,
        }}
      />
    </Payment>
  )
}

export default PathPayment
