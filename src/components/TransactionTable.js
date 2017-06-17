import React from 'react'
import PropTypes from 'prop-types'
import {Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {FormattedRelative, FormattedMessage} from 'react-intl'
import {withSpinner} from './shared/Spinner'
import {shortHash} from '../lib/Utils'

const propTypesRow = {
  compact: PropTypes.bool,
  hash: PropTypes.string,
  opCount: PropTypes.number,
  ledger: PropTypes.number,
  time: PropTypes.string
}

class TransactionRow extends React.Component {
  defaultProps = {
    compact: true
  }

  renderTxHash() {
    const {hash: txHash, compact} = this.props
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
    const {ledger, opCount, time} = this.props
    return (
      <tr>
        <td>{this.renderTxHash()}</td>
        <td><FormattedRelative value={time}/></td>
        <td>{opCount}</td>
        <td>
          <Link to={`/ledger/${ledger}`}>{ledger}</Link>
        </td>
      </tr>
    )
  }
}

TransactionRow.propTypes = propTypesRow

const propTypesTable = {
  compact: PropTypes.bool,
  isLoading: PropTypes.bool,
  records: PropTypes.array.isRequired
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
          {this.props.records.map((tx) => {
            return <TransactionRow key={tx.hash} compact={this.props.compact} {...tx}/>
          })}
        </tbody>
      </Table>
    )
  }
}

TransactionTable.propTypes = propTypesTable

const isLoadingCondition = (props) => props.isLoading === true
const TransactionTableWithSpinner = withSpinner(isLoadingCondition)(TransactionTable)

export default TransactionTableWithSpinner
