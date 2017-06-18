import React from 'react'
import {Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {FormattedRelative, FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'
import {withSpinner} from './shared/Spinner'

const LedgerRow = (props) => <tr>
  <td>
    <Link to={`/ledger/${props.sequence}`}>{props.sequence}</Link>
  </td>
  <td><FormattedRelative value={props.time}/></td>
  <td>{props.txCount}</td>
</tr>

LedgerRow.propTypes = {
  sequence: PropTypes.number,
  txCount: PropTypes.number,
  time: PropTypes.string
}

class LedgerTable extends React.Component {
  render() {
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
          {this.props.records.map((ledger) => <LedgerRow
            key={ledger.sequence}
            sequence={ledger.sequence}
            time={ledger.time}
            txCount={ledger.txCount}/>)}
        </tbody>
      </Table>
    )
  }
}

LedgerTable.propTypes = {
  records: PropTypes.array
}

export default withSpinner()(LedgerTable)
