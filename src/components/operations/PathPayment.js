import React from 'react'
import Payment from './Payment'
import Asset from '../shared/Asset'
import {FormattedMessage} from 'react-intl'

const PathPayment = props =>
  <Payment {...props}>
    <FormattedMessage
      id="operation.payment.path"
      values={{
        asset: (
          <Asset
            code={props.sourceAssetCode}
            issuer={props.sourceAssetIssuer}
            type={props.sourceAssetType}
          />
        ),
        max: props.sourceMax,
      }}
    />
  </Payment>

export default PathPayment
