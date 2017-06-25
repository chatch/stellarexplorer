import React from 'react'
import {Grid, Row, Col, Panel} from 'react-bootstrap'
import {injectIntl} from 'react-intl'

import LedgerTable from './LedgerTableContainer'
import OperationList from './OperationList'
import TransactionTable from './TransactionTableContainer'
import LumensRates from './shared/LumensRates'
import {titleWithRightJustifiedLink} from '../lib/Utils'

const panelHeader = (title, viewAllLink) =>
  titleWithRightJustifiedLink(title, 'View All', viewAllLink)

class Home extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    return (
      <Grid>
        <Row>
          <Col md={6}>
            <Panel header={formatMessage({id: 'stats'})}>
              <div>
                <LumensRates />
              </div>
            </Panel>
            <Panel
              header={panelHeader(formatMessage({id: 'latest.txs'}), '/txs')}
            >
              <TransactionTable fill limit={5} refresh />
            </Panel>
            <Panel
              header={panelHeader(
                formatMessage({id: 'latest.ledgers'}),
                '/ledgers'
              )}
            >
              <LedgerTable fill limit={5} refresh />
            </Panel>
          </Col>
          <Col md={6}>
            <Panel
              header={panelHeader(
                formatMessage({id: 'latest.operations'}),
                '/operations'
              )}
            >
              <OperationList limit={20} refresh />
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default injectIntl(Home)
