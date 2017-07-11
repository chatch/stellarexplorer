import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'

import AccountTable from './AccountTable'

class Accounts extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <AccountTable limit={10} />
        </Row>
      </Grid>
    )
  }
}

export default Accounts
