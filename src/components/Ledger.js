import React from 'react'
import {Grid, Row, Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {FormattedDate, FormattedTime, FormattedMessage} from 'react-intl'

import {server as stellar} from '../lib/Stellar'
import TransactionTable from './TransactionTableContainer'

class LedgerContainer extends React.Component {
  state = {
    seq: 0
  }

  componentDidMount() {
    this.loadLedger(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
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
    return (this.state.seq === 0)
      ? null
      : <Ledger {...this.state}/>
  }
}

class Ledger extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Table>
            <tbody>
              <tr>
                <td>#</td>
                <td>{this.props.seq}</td>
              </tr>
              <tr>
                <td><FormattedMessage id="time"/></td>
                <td><FormattedDate value={this.props.time}/>
                  <FormattedTime value={this.props.time}/></td>
              </tr>
              <tr>
                <td><FormattedMessage id="operations"/></td>
                <td>{this.props.opCount}</td>
              </tr>
              <tr>
                <td><FormattedMessage id="hash"/></td>
                <td>{this.props.hash}</td>
              </tr>
              <tr>
                <td><FormattedMessage id="prevHash"/></td>
                <td>
                  <Link to={`/ledger/${this.props.prevSeq}`}>{this.props.prevHash}</Link>
                </td>
              </tr>
              <tr>
                <td><FormattedMessage id="protocolVersion"/></td>
                <td>{this.props.protocol}</td>
              </tr>
              <tr>
                <td><FormattedMessage id="transactions"/></td>
                <td>{this.props.txCount}</td>
              </tr>
            </tbody>
          </Table>
        </Row>
        {this.props.opCount > 0 && <Row>
          <TransactionTable compact={false} refresh={false} ledger={this.props.seq}/>
        </Row>
}
      </Grid>
    )
  }
}

export default LedgerContainer
