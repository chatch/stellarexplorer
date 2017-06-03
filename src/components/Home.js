import React from 'react'
import { Grid, Row, Col, Panel } from 'react-bootstrap'
import { injectIntl } from 'react-intl'

import LedgerTable from './LedgerTable'
import TransactionTable from './TransactionTable'

const panelHeader = (title, viewAllLink) =>
    <div>
        <span>{title}</span>
        <a href={viewAllLink} className="pull-right">View All</a>
    </div>

class Home extends React.Component {
    render() {
        const {formatMessage} = this.props.intl
        return (
            <Grid>
                <Row>
                    <Col md={6}>
                        <Panel header={panelHeader(formatMessage({id:'latest.ledgers'}), '/ledgers')}>
                            <LedgerTable fill limit={5}/>
                        </Panel>
                    </Col>
                    <Col md={6}>
                        <Panel header={panelHeader(formatMessage({id:'latest.txs'}), '/txs')}>
                            <TransactionTable fill limit={5}/>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default injectIntl(Home)
