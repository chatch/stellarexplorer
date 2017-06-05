import React from 'react'
import {Grid, Row} from 'react-bootstrap'
import Asset from '../shared/Asset'

class Offer extends React.Component {
  render() {
    const d = this.props.data
    return (
      <Grid>
        <Row>
          <div>Offer Id {d.offer_id}</div>
          <div>Amount {d.amount}</div>
          <div>
            Buying Asset:
            <Asset
              type={d.buying_asset_type}
              code={d.buying_asset_code}
              issuer={d.buying_asset_issuer}/>
          </div>
          <div>
            Selling Asset:
            <Asset
              type={d.selling_asset_type}
              code={d.selling_asset_code}
              issuer={d.selling_asset_issuer}/>
          </div>
          <div>Price {d.price}</div>
          <div>Price_r num={d.price_r.n}
            den={d.price_r.d}</div>
        </Row>
      </Grid>
    )
  }
}

export default Offer
