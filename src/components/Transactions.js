import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import {injectIntl} from 'react-intl'
import TransactionTable from './TransactionTableContainer'
import {setTitle} from '../lib/utils'

class Transactions extends React.Component {
render() {
    setTitle('Transactions')
    const {formatMessage} = this.props.intl
    return (
      <Grid>
        <Row>
          <Panel header={formatMessage({id: 'transactions'})}>
            <TransactionTable usePaging showLedger compact={false} limit={20} />
          </Panel>
        </Row>
      </Grid>
    )
  }
}

export default injectIntl(Transactions)
