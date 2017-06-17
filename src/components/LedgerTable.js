import React from 'react'
import {Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {FormattedRelative, FormattedMessage} from 'react-intl'

import {server as stellar} from '../lib/Stellar'
import {withPaging} from './shared/Paging'
import {withSpinner} from './shared/Spinner'

const stellarResponseToLedgers = (rsp) => {
  return rsp.records.map((ledger) => {
    const rec = {
      sequence: ledger.sequence,
      time: ledger.closed_at,
      txCount: ledger.transaction_count
    }
    return rec
  })
}

const stellarResponseToSavedState = (rsp) => {
  const rec = {
    isLoading: false,
    next: rsp.next,
    prev: rsp.prev,
    records: stellarResponseToLedgers(rsp)
  }
  return rec
}

const LedgerRow = (props) => <tr>
  <td>
    <Link to={`/ledger/${props.sequence}`}>{props.sequence}</Link>
  </td>
  <td><FormattedRelative value={props.time}/></td>
  <td>{props.txCount}</td>
</tr>

class LedgerTable extends React.Component {
  render() {
    const ledgerRows = this.props.records.map((ledger) => <LedgerRow
      key={ledger.sequence}
      sequence={ledger.sequence}
      time={ledger.time}
      txCount={ledger.txCount}/>)

    return (
      <Table
        id="ledger-table"
        className="table-striped table-hover table-condensed"
        fill>
        <thead>
          <tr>
            <th>#</th>
            <th><FormattedMessage id="time"/></th>
            <th><FormattedMessage id="transactions"/></th>
          </tr>
        </thead>
        <tbody>
          {ledgerRows}
        </tbody>
      </Table>
    )
  }
}

const isLoading = (props) => (props.isLoading === true)
const LedgerTableWithSpinner = withSpinner(isLoading)(LedgerTable)

class LedgerTableContainer extends React.Component {
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
    records: []
  }

  componentDidMount() {
    this.fetchRecords()
    if (this.props.refresh === true && this.props.usePaging === false) { // don't refresh data on paging views
      this.timerID = setInterval(() => this.fetchRecords(), this.props.refreshRate)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.page === prevProps.page)
      return

    if (this.props.page > prevProps.page)
      this.handleServerResponse(this.state.next())
    else if (this.props.page < prevProps.page)
      this.handleServerResponse(this.state.prev())

    this.setState({isLoading: true, records: []})
  }

  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
      delete this.timerID
    }
  }

  handleServerResponse(rspPromise) {
    rspPromise.then((stellarRsp) => this.setState(stellarResponseToSavedState(stellarRsp))).catch((err) => {
      console.error(`Failed to fetch records: [${err.stack}]`)
      this.setState({isLoading: false, stellarRsp: undefined, records: []})
    })
  }

  fetchRecords() {
    const builder = stellar.ledgers()
    builder.limit(this.props.limit)
    builder.order('desc')
    this.handleServerResponse(builder.call())
  }

  render() {
    return (<LedgerTableWithSpinner
      isLoading={this.state.isLoading}
      records={this.state.records}
      {...this.props}/>)
  }
}

const usePagingCondition = (props) => props.usePaging === true
const LedgerTableContainerWithPaging = withPaging(usePagingCondition)(LedgerTableContainer)

export default LedgerTableContainerWithPaging
