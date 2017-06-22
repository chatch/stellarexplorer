import React from 'react'
import {Grid, Panel, Row, Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {
  injectIntl,
  FormattedDate,
  FormattedTime,
  FormattedMessage,
} from 'react-intl'

import {withServer} from './shared/HOCs'
import TransactionTable from './TransactionTableContainer'

const responseToState = rsp => {
  return {
    seq: rsp.sequence,
    time: rsp.closed_at,
    txCount: rsp.transaction_count,
    opCount: rsp.operation_count,
    hash: rsp.hash,
    prevHash: rsp.prev_hash,
    prevSeq: Number(rsp.sequence) - 1, // horizon doesn't support ledger lookup by hash - so derive seq - does this break?
    protocol: rsp.protocol_version,
    totalCoins: rsp.total_coins, // maybe display these on the front page ...?
    feePool: rsp.fee_pool,
    baseFee: rsp.base_fee,
    baseReserve: rsp.base_reserve,
    maxTxSetSize: rsp.max_tx_set_size,
  }
}

class Ledger extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    return (
      <Grid>
        <Row>
          <Panel header={formatMessage({id: 'ledger'})}>
            <Table>
              <tbody>
                <tr>
                  <td>#</td>
                  <td>{this.props.seq}</td>
                </tr>
                <tr>
                  <td><FormattedMessage id="time" /></td>
                  <td>
                    <FormattedDate value={this.props.time} />&nbsp;
                    <FormattedTime value={this.props.time} />
                  </td>
                </tr>
                <tr>
                  <td><FormattedMessage id="hash" /></td>
                  <td>{this.props.hash}</td>
                </tr>
                <tr>
                  <td><FormattedMessage id="prevHash" /></td>
                  <td>
                    <Link to={`/ledger/${this.props.prevSeq}`}>
                      {this.props.prevHash}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td><FormattedMessage id="protocolVersion" /></td>
                  <td>{this.props.protocol}</td>
                </tr>
                <tr>
                  <td><FormattedMessage id="protocolVersion" /></td>
                  <td>{this.props.protocol}</td>
                </tr>
                {this.props.opCount === 0 &&
                  <tr>
                    <td><FormattedMessage id="transactions" /></td>
                    <td>{this.props.txCount}</td>
                  </tr>}
                <tr>
                  <td><FormattedMessage id="operations" /></td>
                  <td>{this.props.opCount}</td>
                </tr>
              </tbody>
            </Table>
          </Panel>
        </Row>
        {this.props.opCount > 0 &&
          <Row>
            <h3>
              <FormattedMessage id="transactions" />&nbsp;({this.props.txCount})
            </h3>
            <TransactionTable
              compact={false}
              refresh={false}
              ledger={this.props.seq}
            />
          </Row>}
      </Grid>
    )
  }
}

class LedgerContainer extends React.Component {
  state = {
    seq: 0,
  }

  componentDidMount() {
    this.loadLedger(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    this.loadLedger(nextProps.match.params.id)
  }

  loadLedger(ledgerId) {
    this.props.server.ledgers().ledger(ledgerId).call().then(res => {
      this.setState(responseToState(res))
    })
  }

  render() {
    return this.state.seq === 0
      ? null
      : <Ledger {...this.state} {...this.props} />
  }
}

export default injectIntl(withServer(LedgerContainer))
