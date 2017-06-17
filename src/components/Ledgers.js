import React from 'react'
import {Grid, Row} from 'react-bootstrap'
import LedgerTable from './LedgerTable'

class Ledgers extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <LedgerTable usePaging limit={20}/>
        </Row>
      </Grid>
    )
  }
}

export default Ledgers
