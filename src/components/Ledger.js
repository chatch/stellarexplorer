import React from 'react'
import Col from 'react-bootstrap/lib/Col'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Table from 'react-bootstrap/lib/Table'
import {Link} from 'react-router-dom'
import {
  injectIntl,
  FormattedDate,
  FormattedNumber,
  FormattedMessage,
  FormattedTime,
} from 'react-intl'

import {handleFetchDataFailure, shortHash} from '../lib/utils'
import {withServer} from './shared/HOCs'
import TransactionTable from './TransactionTableContainer'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

const STROOPS_PER_LUMEN = 10000000

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
    baseFee: rsp.base_fee_in_stroops,
    baseReserve: rsp.base_reserve_in_stroops,
    maxTxSetSize: rsp.max_tx_set_size,
  }
}

const DetailRow = ({label, children}) => (
  <tr>
    <td>
      <FormattedMessage id={label} />
    </td>
    <td>{children}</td>
  </tr>
)

class Ledger extends React.Component {
  render() {
    const {
      baseFee,
      baseReserve,
      feePool,
      hash,
      maxTxSetSize,
      opCount,
      prevHash,
      prevSeq,
      protocol,
      seq,
      time,
      totalCoins,
      txCount,
      urlFn,
    } = this.props

    const {formatMessage} = this.props.intl

    return (
      <Grid>
        <Row>
          <Panel
            header={titleWithJSONButton(
              <span>
                {formatMessage({id: 'ledger'})}{' '}
                <span className="secondary-heading">{seq}</span>
              </span>,
              urlFn(seq)
            )}
          >
            <Col md={6}>
              <Table>
                <tbody>
                  <DetailRow label="time">
                    <FormattedDate value={time} />{' '}
                    <FormattedTime value={time} />
                  </DetailRow>
                  <DetailRow label="hash">
                    <span title={hash}>{shortHash(hash, 20)}</span>
                  </DetailRow>
                  <DetailRow label="prevHash">
                    <span title={prevHash}>
                      <Link to={`/ledger/${prevSeq}`}>
                        {shortHash(prevHash, 20)}
                      </Link>
                    </span>
                  </DetailRow>
                  <DetailRow label="transactions">{txCount}</DetailRow>
                  <DetailRow label="operations">{opCount}</DetailRow>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <Table>
                <tbody>
                  <DetailRow label="Base Fee">
                    <FormattedNumber value={baseFee} /> stroops
                  </DetailRow>
                  <DetailRow label="Base Reserve">
                    {baseReserve / STROOPS_PER_LUMEN} XLM
                  </DetailRow>
                  <DetailRow label="Max Transactions">
                    {maxTxSetSize} per ledger
                  </DetailRow>
                  <DetailRow label="Fee Pool">
                    <FormattedNumber value={feePool} /> XLM
                  </DetailRow>
                  <DetailRow label="Total Coins">
                    <FormattedNumber value={totalCoins} /> XLM
                  </DetailRow>
                  <DetailRow label="protocolVersion">{protocol}</DetailRow>
                </tbody>
              </Table>
            </Col>
          </Panel>
        </Row>
        {opCount > 0 && (
          <Row>
            <h3>
              <a id="txs-table" aria-hidden="true" />
              <FormattedMessage id="transactions" />&nbsp;({txCount})
            </h3>
            <TransactionTable
              compact={false}
              ledger={seq}
              refresh={false}
              showLedger={false}
            />
          </Row>
        )}
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
    return this.state.seq === 0 ? null : (
      <Ledger
        urlFn={this.props.server.ledgerURL}
        {...this.state}
        {...this.props}
      />
    )
  }
}

export default injectIntl(withServer(LedgerContainer))
