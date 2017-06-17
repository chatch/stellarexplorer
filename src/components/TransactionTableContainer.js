import React from 'react'
import PropTypes from 'prop-types'
import {server as stellar} from '../lib/Stellar'
import {withPaging} from './shared/Paging'
import {isDefInt, isAccount} from '../lib/Utils'
import TransactionTable from './TransactionTable'

const stellarResponseToTxs = (rsp) => {
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

const stellarResponseToSavedState = (rsp) => {
  const rec = {
    isLoading: false,
    next: rsp.next,
    prev: rsp.prev,
    txs: stellarResponseToTxs(rsp)
  }
  return rec
}

const propTypes = {
  compact: PropTypes.bool,
  limit: PropTypes.number,
  page: PropTypes.number,
  usePaging: PropTypes.bool,
  refresh: PropTypes.bool,
  refreshRate: PropTypes.number
}

class TransactionTableContainer extends React.Component {
  static defaultProps = {
    compact: true,
    limit: 5,
    page: 0,
    usePaging: false,
    refresh: false,
    refreshRate: 15000
  }

  state = {
    isLoading: true,
    txs: []
  }

  componentDidMount() {
    this.fetchTransactions()
    if (this.props.refresh === true && this.props.usePaging === false) { // don't refresh data on paging views
      this.timerID = setInterval(() => this.fetchTransactions(), this.props.refreshRate)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.page === prevProps.page)
      return

    if (this.props.page > prevProps.page)
      this.handleServerResponse(this.state.next())
    else if (this.props.page < prevProps.page)
      this.handleServerResponse(this.state.prev())

    this.setState({isLoading: true, txs: []})
  }

  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
      delete this.timerID
    }
  }

  handleServerResponse(rspPromise) {
    rspPromise.then((stellarRsp) => this.setState(stellarResponseToSavedState(stellarRsp))).catch((err) => {
      console.error(`Failed to fetch transactions: [${err.stack}]`)
      this.setState({isLoading: false, stellarRsp: undefined, txs: []})
    })
  }

  fetchTransactions() {
    const builder = stellar.transactions()
    if (isDefInt(this.props, 'ledger'))
      builder.forLedger(this.props.ledger)
    if (isAccount(this.props.account))
      builder.forAccount(this.props.account)
    builder.limit(this.props.limit)
    builder.order('desc')
    this.handleServerResponse(builder.call())
  }

  render() {
    return (<TransactionTable
      isLoading={this.state.isLoading}
      txs={this.state.txs}
      {...this.props}/>)
  }
}

TransactionTableContainer.propTypes = propTypes

const usePagingCondition = (props) => props.usePaging === true
const TransactionTableContainerWithPaging = withPaging(usePagingCondition)(TransactionTableContainer)
export default TransactionTableContainerWithPaging
