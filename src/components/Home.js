import React from 'react'
import {Grid, Row, Col, Panel} from 'react-bootstrap'
import {injectIntl} from 'react-intl'

import LedgerTable from './LedgerTableContainer'
import OperationList from './OperationList'
import TransactionTable from './TransactionTableContainer'
import LumensRates from './shared/LumensRates'
import Title from './shared/TitleWithLink'

const panelHeader = (title, viewAllLink) =>
  <Title rightLinkAddr={viewAllLink} rightLinkLabel="View All" title={title} />

class Home extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    return (
      <Grid>
        <Row>
          <Col md={4}>
            <Panel
              header={panelHeader(
                formatMessage({id: 'latest.ledgers'}),
                '/ledgers'
              )}
            >
              <LedgerTable fill limit={5} refresh />
            </Panel>
            <Panel
              header={panelHeader(formatMessage({id: 'latest.txs'}), '/txs')}
            >
              <TransactionTable compact fill limit={5} refresh />
            </Panel>
            <Panel header={formatMessage({id: 'stats'})}>
              <div>
                <LumensRates />
              </div>
            </Panel>
          </Col>
          <Col md={8}>
            <Panel
              header={panelHeader(
                formatMessage({id: 'latest.operations'}),
                '/operations'
              )}
            >
              <OperationList compact limit={20} refresh />
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default injectIntl(Home)
