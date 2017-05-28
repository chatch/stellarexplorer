import React from 'react'
import { Grid, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl'

import { server as stellar } from '../lib/Stellar'
import TransactionTable from './TransactionTable'

class Ledger extends React.Component {
    componentDidMount() {
        this.loadLedger(this.props.match.params.id)
    }

    componentWillReceiveProps(nextProps){
        this.loadLedger(nextProps.match.params.id)
    }

    loadLedger(ledgerId) {
        stellar.ledgers().ledger(ledgerId).call().then((res) => {
            this.setState({
                seq: res.sequence,
                time: res.closed_at,
                txCount: res.transaction_count,
                opCount: res.operation_count,
                hash: res.hash,
                prevHash: res.prev_hash,
                prevSeq: Number(res.sequence) - 1, // horizon doesn't support ledger lookup by hash - so derive seq - does this break?
                protocol: res.protocol_version
            })
        })
    }

    render() {
        if (this.state === null) return null
        const s = this.state
        return (
            <Grid>
                <Row>
                  <Table>
                    <tbody>
                      <tr>
                        <td>#</td>
                        <td>{s.seq}</td>
                      </tr>
                      <tr>
                        <td><FormattedMessage id="time" /></td>
                        <td><FormattedDate value={s.time}/> <FormattedTime value={s.time}/></td>
                      </tr>
                      <tr>
                        <td><FormattedMessage id="operations" /></td>
                        <td>{s.opCount}</td>
                      </tr>
                      <tr>
                        <td><FormattedMessage id="hash" /></td>
                        <td>{s.hash}</td>
                      </tr>
                      <tr>
                        <td><FormattedMessage id="prevHash" /></td>
                        <td>
                          <Link to={`/ledger/${s.prevSeq}`}>{s.prevHash}</Link>
                        </td>
                      </tr>
                      <tr>
                        <td><FormattedMessage id="protocolVersion" /></td>
                        <td>{s.protocol}</td>
                      </tr>
                      <tr>
                        <td><FormattedMessage id="transactions" /></td>
                        <td>{s.txCount}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Row>
                <Row>
                  <TransactionTable ledger={this.state.seq}/>
                </Row>
            </Grid>
        )
    }
}

export default Ledger
