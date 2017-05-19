import React from 'react'
import {Grid, Row, Panel} from 'react-bootstrap'

import LedgerTable from './LedgerTable'
import TransactionTable from './TransactionTable'

class AppFront extends React.Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Panel header="Ledgers" bsStyle="warning">
                        <LedgerTable/>
                    </Panel>
                </Row>
                <Row>
                    <Panel header="Transactions" bsStyle="warning">
                        <TransactionTable/>
                    </Panel>
                </Row>
            </Grid>
        )
    }
}

export default AppFront
