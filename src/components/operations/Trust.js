import React from 'react'
import {Grid, Row, Table} from 'react-bootstrap'

class Trust extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Grid>
                <Row>
                    <Table>
                        <tbody>
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
                                <td>{d.asset_issuer}</td>
                            </tr>
                            <tr>
                                <td>Trustee</td>
                                <td>{d.trustee}</td>
                            </tr>
                            <tr>
                                <td>Trustor</td>
                                <td>{d.trustor}</td>
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

export default Trust
