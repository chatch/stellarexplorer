import React from 'react'
import {Grid, Row} from 'react-bootstrap'

class Trust extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Grid>
                <Row>
                    <div>Asset Type {d.asset_type}</div>
                    <div>Asset Code {d.asset_code}</div>
                    <div>Asset Issuer {d.asset_issuer}</div>
                    <div>Trustee {d.trustee}</div>
                    <div>Trustor {d.trustor}</div>
                    {this.props.children}
                </Row>
            </Grid>
        )
    }
}

export default Trust
