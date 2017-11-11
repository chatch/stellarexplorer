import React from 'react'
import PropTypes from 'prop-types'
import Table from 'react-bootstrap/lib/Table'
import {Link} from 'react-router-dom'
import {FormattedRelative, FormattedMessage} from 'react-intl'
import {withSpinner} from './shared/Spinner'
import TransactionHash from './shared/TransactionHash'

class TransactionRow extends React.Component {
  static defaultProps = {
    compact: true,
  }

  render() {
    const {ledger, opCount, time} = this.props
    return (
      <tr>
        <td>
          <TransactionHash
            hash={this.props.hash}
            compact={this.props.compact}
          />
        </td>
        <td>
          <FormattedRelative value={time} />
        </td>
        <td>{opCount}</td>
        <td>
          <Link to={`/ledger/${ledger}`}>{ledger}</Link>
        </td>
      </tr>
    )
  }
}

TransactionRow.propTypes = {
  compact: PropTypes.bool,
  hash: PropTypes.string,
  ledger: PropTypes.number,
  opCount: PropTypes.number,
  time: PropTypes.string,
}

class TransactionTable extends React.Component {
  render() {
    return (
      <Table
        id="transaction-table"
        className="table-striped table-hover table-condensed"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>
              <FormattedMessage id="time" />
            </th>
            <th>
              <FormattedMessage
                id={this.props.compact === true ? 'ops' : 'operations'}
              />
            </th>
            <th>
              <FormattedMessage id="ledger" />
            </th>
          </tr>
        </thead>
        <tbody>
          {this.props.records.map(tx => (
            <TransactionRow
              key={tx.hash}
              compact={this.props.compact}
              {...tx}
            />
          ))}
        </tbody>
      </Table>
    )
  }
}

TransactionTable.propTypes = {
  compact: PropTypes.bool,
  records: PropTypes.array.isRequired,
}

export default withSpinner()(TransactionTable)
