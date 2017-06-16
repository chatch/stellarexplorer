import React from 'react'
import {Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {FormattedRelative, FormattedMessage} from 'react-intl'
import {compose} from 'recompose'
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

const withAll = compose(withPaging(pagingCondition), withSpinner(loadingCondition))
const TransactionTableWithAll = withAll(TransactionTable)

class TransactionTableContainer extends React.Component {
  static defaultProps = {
    compact: true,
    limit: 5,
    paging: false,
    refresh: true,
    refreshRate: 15000
  }

  state = {
    isLoading: true,
    txs: []
  }

  componentDidMount() {
    this.updateWithLatest()
    if (this.props.refresh === true && this.props.paging === false) { // don't refresh data on paging views
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
      if (reverse === true) {
        newState.txs = newState.txs.reverse()
      }
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
