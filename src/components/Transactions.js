import React from 'react'
import { Grid, Row } from 'react-bootstrap'
import TransactionTable from './TransactionTable'

class Transactions extends React.Component {
  render() {
    return (
        <Grid>
            <Row>
                <TransactionTable limit={10}/>
            </Row>
        </Grid>
    )
  }
}

export default Transactions
