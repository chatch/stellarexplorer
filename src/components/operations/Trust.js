import React from 'react'
import {Grid, Row, Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Asset from '../shared/Asset'
import AccountLink from '../shared/AccountLink'

class Trust extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Grid>
                <Row>
                    <Table>
                        <tbody>
                            <tr>
                                <td>Asset</td>
                                <td><Asset code={d.asset_code} type={d.asset_type} issuer={d.asset_issuer}/></td>
                            </tr>
                            <tr>
                                <td>Trustee</td>
                                <td><AccountLink account={d.trustee}/></td>
                            </tr>
                            <tr>
                                <td>Trustor</td>
                                <td><AccountLink account={d.trustor}/></td>
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
