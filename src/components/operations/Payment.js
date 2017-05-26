import React from 'react'
import {Grid, Row, Table} from 'react-bootstrap'
import { Link } from 'react-router-dom'

class Payment extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Grid>
                <Row>
                    <Table>
                        <tbody>
                          <tr>
                              <td>From</td>
                              <td><Link to={`/account/${d.from}`}>{d.from}</Link></td>
                          </tr>
                          <tr>
                              <td>To</td>
                              <td><Link to={`/account/${d.to}`}>{d.to}</Link></td>
                          </tr>
                          <tr>
                              <td>Asset Code</td>
                              <td>{d.asset_code}</td>
                          </tr>
                          <tr>
                              <td>Asset Type</td>
                              <td>{d.asset_type}</td>
                          </tr>
                          <tr>
                              <td>Asset Issuer</td>
                              <td><Link to={`/account/${d.asset_issuer}`}>{d.asset_issuer}</Link></td>
                          </tr>
                          <tr>
                              <td>Amount</td>
                              <td>{d.amount}</td>
                          </tr>
                        </tbody>
                    </Table>
                </Row>
                <Row>
                    {this.props.children}
                </Row>
            </Grid>
        )
    }
}

export default Payment
