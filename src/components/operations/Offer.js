import React from 'react'
import {Grid, Row} from 'react-bootstrap'

class Offer extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Grid>
                <Row>
                    <div>Offer Id {d.offer_id}</div>
                    <div>Amount {d.amount}</div>
                    <div>Buying Asset code {d.buying_asset_code}</div>
                    <div>Buying Asset issuer {d.buying_asset_issuer}</div>
                    <div>Buying Asset type {d.buying_asset_type}</div>
                    <div>Price {d.price}</div>
                    <div>Price_r num={d.price_r.n} den={d.price_r.d}</div>
                    <div>Selling Asset code {d.selling_asset_code}</div>
                    <div>Selling Asset issuer {d.selling_asset_issuer}</div>
                    <div>Selling Asset type {d.selling_asset_type}</div>
                </Row>
            </Grid>
        )
    }
}

export default Offer
