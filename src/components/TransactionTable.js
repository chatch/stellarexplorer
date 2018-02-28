import React from 'react'
import PropTypes from 'prop-types'
import Table from 'react-bootstrap/lib/Table'
import {Link} from 'react-router-dom'
import {FormattedMessage} from 'react-intl'

import AccountLink from './shared/AccountLink'
import {withSpinner} from './shared/Spinner'
import TimeSynchronisedFormattedRelative from './shared/TimeSynchronizedFormattedRelative'
import TransactionHash from './shared/TransactionHash'

class TransactionRow extends React.Component {
  static defaultProps = {
    compact: true,
  }

  render() {
    const {
      compact,
      hash,
      sourceAccount,
      ledger,
      parentRenderTimestamp,
      opCount,
      time,
    } = this.props
    return (
      <tr>
        <td>
          <TransactionHash hash={hash} compact={compact} />
        </td>
        {compact === false && (
          <td className="account-badge">
            <AccountLink account={sourceAccount} />
          </td>
        )}
        <td>
          <Link to={`/ledger/${ledger}`}>{ledger}</Link>
        </td>
        <td>
          <Link to={`/tx/${hash}#operations-table`}>{opCount}</Link>
        </td>
        <td>
          <span title={time}>
            <TimeSynchronisedFormattedRelative
              initialNow={parentRenderTimestamp}
              value={time}
            />
          </span>
        </td>
      </tr>
    )
  }
}

TransactionRow.propTypes = {
  compact: PropTypes.bool.isRequired,
  hash: PropTypes.string.isRequired,
  ledger: PropTypes.number.isRequired,
  parentRenderTimestamp: PropTypes.number.isRequired,
  sourceAccount: PropTypes.string.isRequired,
  opCount: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
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
            {this.props.compact === false && (
              <th>
                <FormattedMessage id="source.account" />
              </th>
            )}
            <th>
              <FormattedMessage id="ledger" />
            </th>
            <th>
              <FormattedMessage
                id={this.props.compact ? 'ops' : 'operations'}
              />
            </th>
            <th>
              <FormattedMessage id="time" />
            </th>
          </tr>
        </thead>
        <tbody>
          {this.props.records.map(tx => (
            <TransactionRow
              key={tx.hash}
              compact={this.props.compact}
              parentRenderTimestamp={this.props.parentRenderTimestamp}
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
  parentRenderTimestamp: PropTypes.number,
  records: PropTypes.array.isRequired,
}

export default withSpinner()(TransactionTable)
