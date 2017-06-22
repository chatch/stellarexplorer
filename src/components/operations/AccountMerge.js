import React from 'react'
import {Grid, Row} from 'react-bootstrap'
import AccountLink from '../shared/AccountLink'

class AccountMerge extends React.Component {
  render() {
    const d = this.props.data
    return (
      <Grid>
        <Row>
          <div>
            Into: &nbsp;
            <AccountLink account={d.into} />
          </div>
        </Row>
      </Grid>
    )
  }
}

export default AccountMerge
