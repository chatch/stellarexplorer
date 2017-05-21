import React from 'react'
import {Grid, Row} from 'react-bootstrap'

class AccountMerge extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Grid>
                <Row>
                    <div>Into {d.into}</div>
                </Row>
            </Grid>
        )
    }
}

export default AccountMerge
