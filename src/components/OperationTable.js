import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import Table from 'react-bootstrap/lib/Table'
import {FormattedMessage} from 'react-intl'

import mapKeys from 'lodash/mapKeys'
import camelCase from 'lodash/camelCase'

import {withDataFetchingContainer} from './shared/DataFetchingContainer'
import {withPaging} from './shared/Paging'
import {withSpinner} from './shared/Spinner'
import Operation from './operations/Operation'

const OperationTable = props => (
  <Table
    id="operation-table"
    className="table-striped table-hover table-condensed"
  >
    <thead>
      <tr>
        <th>
          <FormattedMessage id="account" />
        </th>
        <th>
          <FormattedMessage id="operation" />
        </th>
        {props.compact === false && (
          <th>
            <FormattedMessage id="transaction" />
          </th>
        )}
        <th>
          <FormattedMessage id="time" />
        </th>
        <th />
      </tr>
    </thead>
    <tbody>
      {props.records.map(op => (
        <Operation
          key={op.id}
          compact={props.compact}
          op={op}
          opURLFn={props.server.opURL}
          parentRenderTimestamp={props.parentRenderTimestamp}
        />
      ))}
    </tbody>
  </Table>
)

OperationTable.propTypes = {
  compact: PropTypes.bool,
  parentRenderTimestamp: PropTypes.number,
  records: PropTypes.array.isRequired,
  server: PropTypes.object.isRequired,
}

const rspRecToPropsRec = record => {
  record.time = record.created_at
  return mapKeys(record, (v, k) => camelCase(k))
}

const fetchRecords = ({account, limit, server, tx}) => {
  const builder = server.operations()
  if (tx) builder.forTransaction(tx)
  if (account) builder.forAccount(account)
  builder.limit(limit)
  builder.order('desc')
  return builder.call()
}

const callBuilder = props => props.server.operations()

const enhance = compose(
  withPaging(),
  withDataFetchingContainer(fetchRecords, rspRecToPropsRec, callBuilder),
  withSpinner()
)

export default enhance(OperationTable)
