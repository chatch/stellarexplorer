import React from 'react'
import {Grid, Row, Table} from 'react-bootstrap'

class SetOptions extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Grid>
                <Row>
                    <Table>
                        <tbody>
                            <tr>
                                <td>Signer Key</td>
                                <td>{d.signer_key}</td>
                            </tr>
                            <tr>
                                <td>Signer Weight</td>
                                <td>{d.signer_weight}</td>
                            </tr>
                            <tr>
                                <td>Master Key Weight</td>
                                <td>{d.master_key_weight}</td>
                            </tr>
                            <tr>
                                <td>Low Threshold</td>
                                <td>{d.low_threshold}</td>
                            </tr>
                            <tr>
                                <td>Med Threshold</td>
                                <td>{d.med_threshold}</td>
                            </tr>
                            <tr>
                                <td>High Threshold</td>
                                <td>{d.high_threshold}</td>
                            </tr>
                            <tr>
                                <td>Home Domain</td>
                                <td>{d.home_domain}</td>
                            </tr>
                            <tr>
                                <td>Set Flags</td>
                                <td>{d.set_flags}</td>
                            </tr>
                            <tr>
                                <td>Set Flags_s</td>
                                <td>{d.set_flags_s}</td>
                            </tr>
                            <tr>
                                <td>Clear Flags</td>
                                <td>{d.clear_flags}</td>
                            </tr>
                            <tr>
                                <td>Clear Flags_s</td>
                                <td>{d.clear_flags_s}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
            </Grid>
        )
    }
}

export default SetOptions
