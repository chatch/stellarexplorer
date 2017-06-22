import React from 'react'
import {Grid, Panel, Row} from 'react-bootstrap'
import {injectIntl} from 'react-intl'
import TransactionTable from './TransactionTableContainer'

class Transactions extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    return (
      <Grid>
        <Row>
          <Panel header={formatMessage({id: 'transactions'})}>
            <TransactionTable usePaging compact={false} limit={20} />
          </Panel>
        </Row>
      </Grid>
    )
  }
}

export default injectIntl(Transactions)
