import React from 'react'
import {Grid, Row} from 'react-bootstrap'

class Payment extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Grid>
                <Row>
                    <div>From {d.from}</div>
                    <div>To {d.to}</div>
                    <div>Asset Type {d.asset_type}</div>
                    <div>Asset Code {d.asset_code}</div>
                    <div>Asset Issuer {d.asset_issuer}</div>
                    <div>Amount {d.amount}</div>
                    {this.props.children}
                </Row>
            </Grid>
        )
    }
}

export default Payment
