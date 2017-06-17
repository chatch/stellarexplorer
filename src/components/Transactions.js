import React from 'react'
import {Grid, Row} from 'react-bootstrap'
import TransactionTable from './TransactionTableContainer'

class Transactions extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <TransactionTable usePaging compact={false} limit={20}/>
        </Row>
      </Grid>
    )
  }
}

export default Transactions
