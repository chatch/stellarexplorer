import React from 'react'
import {Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {FormattedRelative, FormattedMessage} from 'react-intl'
import {server as stellar} from '../lib/Stellar'
import {withPaging, withSpinner} from './shared/HOCs'
import {isDefInt, isAccount, shortHash} from '../lib/Utils'

const responseToTxs = (rsp) => {
  return rsp.records.map((tx) => {
    const rec = {
      hash: tx.hash,
      time: tx.created_at,
      opCount: tx.operation_count,
      ledger: tx.ledger_attr
    }
    return rec
  })
}

class TransactionRow extends React.Component {
  renderTxHash() {
    const txHash = this.props.hash
    const compact = (this.props.compact === true)
    const hashLabel = (compact)
      ? shortHash(txHash)
      : txHash
    const className = (!compact)
      ? "monospace"
      : ""
    return (
      <span title={txHash} className={className}>
        <Link to={`/tx/${txHash}`}>{hashLabel}</Link>
      </span>
    )
  }

  render() {
    return (
      <tr>
        <td>{this.renderTxHash()}</td>
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

const loadingCondition = (props) => props.isLoading === true
const pagingCondition = (props) => props.paging === true

const TransactionTableWithPaging = withPaging(TransactionTable, pagingCondition)
const TransactionTableWithAll = withSpinner(TransactionTableWithPaging, loadingCondition)

class TransactionTableContainer extends React.Component {
  static defaultProps = {
    compact: true,
    limit: 5,
    paging: false,
    refreshRate: 15000
  }

  state = {
    isLoading: true,
    txs: []
  }

  componentDidMount() {
    this.updateWithLatest()
    if (this.props.paging === false) { // don't refresh data on paging views
      this.timerID = setInterval(() => this.updateWithLatest(), this.props.refreshRate);
    }
  }

  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
      delete this.timerID
    }
  }

  transactions(props) {
    const builder = stellar.transactions()
    if (isDefInt(props, 'ledger'))
      builder.forLedger(props.ledger)
    if (isAccount(props.account))
      builder.forAccount(props.account)
    builder.limit(props.limit)
    builder.order('desc')
    return builder.call()
  }

  updateWithLatest() {
    this.update(this.transactions(this.props))
  }

  update(txsPromise, reverse = false) {
    console.log(`updating table`)
    this.setState({isLoading: true, txs: []})
    txsPromise.then((rsp) => {
      const newState = {
        txs: responseToTxs(rsp),
        isLoading: false,
        next: (reverse === true)
          ? rsp.prev
          : rsp.next,
        prev: (reverse === true)
          ? rsp.next
          : rsp.prev
      }
      const nt = newState.txs
      if (reverse === true) {
        console.log(`reverse`);
        newState.txs = newState.txs.reverse()
      }
      console.log(`new: ledger: first: ${nt[0].time}|${nt[0].ledger} last: ${nt[nt.length - 1].time}|${nt[nt.length - 1].ledger}`)
      this.setState(newState)
    }).catch((err) => {
      console.error(`Failed to fetch transactions: [${err.stack}]`)
      this.setState({txs: [], isLoading: false})
    })
  }

  handleClickNext = () => {
    this.changePage(this.state.next)
  }

  handleClickPrev = () => {
    this.changePage(this.state.prev, true)
  }

  changePage = (pageFunc, reverse = false) => {
    if (!pageFunc) {
      console.error(`pageFunc not defined`)
      return
    }
    this.update(pageFunc(), reverse)
  }

  render() {
    return (<TransactionTableWithAll
      isLoading={this.state.isLoading}
      txs={this.state.txs}
      handleClickNext={this.handleClickNext}
      handleClickPrev={this.handleClickPrev}
      {...this.props}/>)
  }
}

export default TransactionTableContainer
