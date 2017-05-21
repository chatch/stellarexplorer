import React from 'react'
import {Grid, Row} from 'react-bootstrap'

class CreateAccount extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Grid>
                <Row>
                    <div>Account {d.account}</div>
                    <div>Funder {d.funder}</div>
                    <div>Starting Balance {d.starting_balance}</div>
                </Row>
            </Grid>
        )
    }
}

export default CreateAccount
