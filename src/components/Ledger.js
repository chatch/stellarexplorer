import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Table from 'react-bootstrap/lib/Table'
import {Link} from 'react-router-dom'
import {
  injectIntl,
  FormattedDate,
  FormattedTime,
  FormattedMessage,
} from 'react-intl'

import {handleFetchDataFailure} from '../lib/utils'
import {withServer} from './shared/HOCs'
import TransactionTable from './TransactionTableContainer'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

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
    const {
      hash,
      opCount,
      prevHash,
      prevSeq,
      protocol,
      seq,
      time,
      txCount,
      urlFn,
    } = this.props

    const {formatMessage} = this.props.intl

    return (
      <Grid>
        <Row>
          <Panel
            header={titleWithJSONButton(
              formatMessage({id: 'ledger'}),
              urlFn(seq)
            )}
          >
            <Table>
              <tbody>
                <tr>
                  <td>#</td>
                  <td>
                    {seq}
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="time" />
                  </td>
                  <td>
                    <FormattedDate value={time} />&nbsp;
                    <FormattedTime value={time} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="hash" />
                  </td>
                  <td>
                    {hash}
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="prevHash" />
                  </td>
                  <td>
                    <Link to={`/ledger/${prevSeq}`}>
                      {prevHash}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="protocolVersion" />
                  </td>
                  <td>
                    {protocol}
                  </td>
                </tr>
                {opCount === 0 &&
                  <tr>
                    <td>
                      <FormattedMessage id="transactions" />
                    </td>
                    <td>
                      {txCount}
                    </td>
                  </tr>}
                <tr>
                  <td>
                    <FormattedMessage id="operations" />
                  </td>
                  <td>
                    {opCount}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Panel>
        </Row>
        {opCount > 0 &&
          <Row>
            <h3>
              <FormattedMessage id="transactions" />&nbsp;({txCount})
            </h3>
            <TransactionTable compact={false} refresh={false} ledger={seq} />
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
    this.props.server
      .ledgers()
      .ledger(ledgerId)
      .call()
      .then(res => {
        this.setState(responseToState(res))
        return null
      })
      .catch(handleFetchDataFailure(ledgerId))
  }

  render() {
    return this.state.seq === 0
      ? null
      : <Ledger
          urlFn={this.props.server.ledgerURL}
          {...this.state}
          {...this.props}
        />
  }
}

export default injectIntl(withServer(LedgerContainer))
