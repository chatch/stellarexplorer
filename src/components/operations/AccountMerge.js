import React from 'react'
import {Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router-dom'

class AccountMerge extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Grid>
                <Row>
                    <div>Into <Link to={`/account/${d.into}`}>{d.into}</Link></div>
                </Row>
            </Grid>
        )
    }
}

export default AccountMerge
