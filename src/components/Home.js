import React from 'react'
import { Grid, Row, Col, Panel } from 'react-bootstrap'

import LedgerTable from './LedgerTable'
import TransactionTable from './TransactionTable'

class Home extends React.Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col md={6}>
                        <Panel header="Latest Ledgers" bsStyle="warning">
                            <LedgerTable limit={5}/>
                        </Panel>
                    </Col>
                    <Col md={6}>
                        <Panel header="Latest Transactions" bsStyle="warning">
                            <TransactionTable limit={5}/>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default Home
