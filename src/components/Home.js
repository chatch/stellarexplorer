import React from 'react'
import { Grid, Row, Col, Panel } from 'react-bootstrap'
import { injectIntl } from 'react-intl'

import LedgerTable from './LedgerTable'
import TransactionTable from './TransactionTable'

class Home extends React.Component {
    render() {
        const {formatMessage} = this.props.intl;
        return (
            <Grid>
                <Row>
                    <Col md={6}>
                        <Panel header={formatMessage({id:'latest.ledgers'})} bsStyle="warning">
                            <LedgerTable limit={5}/>
                        </Panel>
                    </Col>
                    <Col md={6}>
                        <Panel header={formatMessage({id:'latest.txs'})} bsStyle="warning">
                            <TransactionTable limit={5}/>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default injectIntl(Home)
