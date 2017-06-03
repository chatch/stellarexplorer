import React from 'react'
import {Grid, Row} from 'react-bootstrap'

import Asset from '../shared/Asset'
import AccountLink from '../shared/AccountLink'

class Payment extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Grid>
                <Row>
                    <AccountLink account={d.from}/>
                    &nbsp;TO&nbsp;
                    <AccountLink account={d.to}/>
                </Row>
                <Row>
                    <Asset type={d.asset_type}
                           code={d.asset_code}
                           issuer={d.asset_issuer} /> {d.amount}
                </Row>
                <Row>
                    {this.props.children}
                </Row>
            </Grid>
        )
    }
}

export default Payment
