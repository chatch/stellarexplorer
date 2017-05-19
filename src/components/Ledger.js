import React from 'react'
import { Grid, Row } from 'react-bootstrap'

class Ledger extends React.Component {
  render() {
    const id = this.props.match.params.id
    return (
        <Grid>
            <Row>
                <div>Ledger Number {id}</div>
            </Row>
        </Grid>
    )
  }
}

export default Ledger
