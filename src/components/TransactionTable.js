import React from 'react'
import {Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {FormattedRelative, FormattedMessage} from 'react-intl'
import {server as stellar} from '../lib/Stellar'
import {withSpinner} from './shared/HOCs'
import {isDefInt, isAccount, shortHash} from '../lib/Utils'

const REFRESH_RATE = 15000
const DEFAULT_LIMIT = 5

const responseToTxs = (rsp) => {
  return rsp.records.map((tx) => {
    return {hash: tx.hash, time: tx.created_at, opCount: tx.operation_count, ledger: tx.ledger_attr}
  })
}

const isLoading = (props) => (props.isLoading === true)

class TransactionRow extends React.Component {
  render() {
    const txHash = this.props.hash
    const hashLabel = (this.props.compact === true)
      ? shortHash(txHash)
      : txHash
    return (
      <tr>
        <td>
          <span title={txHash} className={"monospace"}>
            <Link to={`/tx/${txHash}`}>{hashLabel}</Link>
          </span>
        </td>
        <td><FormattedRelative value={this.props.time}/></td>
        <td>{this.props.opCount}</td>
        <td>
          <Link to={`/ledger/${this.props.ledger}`}>{this.props.ledger}</Link>
        </td>
      </tr>
    )
  }
}

class TransactionTable extends React.Component {
  renderRow(tx) {}

  render() {
    return (
      <Table
        id="transaction-table"
        className="table-striped table-hover table-condensed">
        <thead>
          <tr>
            <th>#</th>
            <th><FormattedMessage id="time"/></th>
            <th><FormattedMessage id="operations"/></th>
            <th><FormattedMessage id="ledger"/></th>
          </tr>
        </thead>
        <tbody>
          {this.props.txs.map((tx) => {
            return <TransactionRow key={tx.hash} compact={this.props.compact} {...tx}/>
          })}
        </tbody>
      </Table>
    )
  }
}
const WrappedTransactionTable = withSpinner(TransactionTable, isLoading)

class TransactionTableContainer extends React.Component {
  static defaultProps = {
    compact: true
  }

  state = {
    isLoading: true,
    txs: []
  }

  componentDidMount() {
    this.update()
    this.timerID = setInterval(() => this.update(), REFRESH_RATE);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  update() {
    this.setState({isLoading: true, txs: []})
    this.transactions(this.props).then((stellarRsp) => {
      this.setState({txs: responseToTxs(stellarRsp), isLoading: false})
    }).catch((err) => {
      console.error(`Failed to fetch transactions: [${err}]`)
      this.setState({txs: [], isLoading: false})
    })
  }

  transactions(props) {
    const builder = stellar.transactions()

    if (isDefInt(props, 'ledger'))
      builder.forLedger(props.ledger)

    if (isAccount(props.account))
      builder.forAccount(props.account)

    const limit = (isDefInt(props, 'limit'))
      ? props.limit
      : DEFAULT_LIMIT
    builder.limit(limit)

    builder.order('desc')

    return builder.call()
  }

  render() {
    return (<WrappedTransactionTable
      isLoading={this.state.isLoading}
      txs={this.state.txs}
      compact={this.props.compact}/>)
  }
}

export default TransactionTableContainer
