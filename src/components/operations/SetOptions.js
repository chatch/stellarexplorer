import React from 'react'
import {Grid, Row} from 'react-bootstrap'

class SetOptions extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Grid>
                <Row>
                    <div>Signer Key {d.signer_key}</div>
                    <div>Signer Weight {d.signer_weight}</div>
                    <div>Master Key Weight {d.master_key_weight}</div>
                    <div>Low Threshold {d.low_threshold}</div>
                    <div>Med Threshold {d.med_threshold}</div>
                    <div>High Threshold {d.high_threshold}</div>
                    <div>Home Domain {d.home_domain}</div>
                    <div>Set Flags {d.set_flags}</div>
                    <div>Set Flags_s {d.set_flags_s}</div>
                    <div>Clear Flags {d.clear_flags}</div>
                    <div>Clear Flags_s {d.clear_flags_s}</div>
                </Row>
            </Grid>
        )
    }
}

export default SetOptions
