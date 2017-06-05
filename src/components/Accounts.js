import React from 'react'
import {Grid, Row} from 'react-bootstrap'
import AccountTable from './AccountTable'

class Accounts extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <AccountTable limit={10}/>
        </Row>
      </Grid>
    )
  }
}

export default Accounts
