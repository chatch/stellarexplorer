import React from 'react'
import Payment from './Payment'
import Asset from '../shared/Asset'

const PathPayment = props =>
  <Payment {...props}>
    {' path '}
    <Asset
      code={props.sourceAssetCode}
      issuer={props.sourceAssetIssuer}
      type={props.sourceAssetType}
    />
    {` max ${props.sourceMax}`}
  </Payment>

export default PathPayment
