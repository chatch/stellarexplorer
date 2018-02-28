import React from 'react'
import Table from 'react-bootstrap/lib/Table'
import {Link} from 'react-router-dom'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'
import {withSpinner} from './shared/Spinner'
import TimeSynchronisedFormattedRelative from './shared/TimeSynchronizedFormattedRelative'

const LedgerRow = props => (
  <tr>
    <td>
      <Link to={`/ledger/${props.sequence}`}>{props.sequence}</Link>
    </td>
    <td>
      {props.txCount > 0 ? (
        <Link to={`/ledger/${props.sequence}#txs-table`}>{props.txCount}</Link>
      ) : (
        props.txCount
      )}
    </td>
    <td>
      <span title={props.time}>
        <TimeSynchronisedFormattedRelative
          initialNow={props.parentRenderTimestamp}
          value={props.time}
        />
      </span>
    </td>
  </tr>
)

LedgerRow.propTypes = {
  parentRenderTimestamp: PropTypes.number,
  sequence: PropTypes.number,
  txCount: PropTypes.number,
  time: PropTypes.string,
}

class LedgerTable extends React.PureComponent {
  render() {
    return (
      <Table
        id="ledger-table"
        className="table-striped table-hover table-condensed"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>
              <FormattedMessage id="transactions" />
            </th>
            <th>
              <FormattedMessage id="time" />
            </th>
          </tr>
        </thead>
        <tbody>
          {this.props.records.map(ledger => (
            <LedgerRow
              key={ledger.sequence}
              sequence={ledger.sequence}
              parentRenderTimestamp={this.props.parentRenderTimestamp}
              time={ledger.time}
              txCount={ledger.txCount}
            />
          ))}
        </tbody>
      </Table>
    )
  }
}

LedgerTable.propTypes = {
  parentRenderTimestamp: PropTypes.number,
  records: PropTypes.array,
}

export default withSpinner()(LedgerTable)
