import React from 'react'
import Payment from './Payment'
import Asset from '../shared/Asset'

class PathPayment extends React.Component {
  render() {
    const d = this.props.data
    return (
      <Payment data={d}>
        <div>
          <Asset
            code={d.source_asset_code}
            issuer={d.source_asset_issuer}
            type={d.source_asset_type}/>
        </div>
        <div>Source Max {d.source_max}</div>
      </Payment>
    )
  }
}

export default PathPayment
