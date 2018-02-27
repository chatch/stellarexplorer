import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import Table from 'react-bootstrap/lib/Table'
import {FormattedMessage} from 'react-intl'

import mapKeys from 'lodash/mapKeys'
import camelCase from 'lodash/camelCase'

import Operation from './operations/Operation'
import {withDataFetchingContainer} from './shared/DataFetchingContainer'
import {withPaging} from './shared/Paging'
import {withSpinner} from './shared/Spinner'

const PaymentTable = ({compact, server, parentRenderTimestamp, records}) => (
  <Table
    id="payment-table"
    className="table-striped table-hover table-condensed"
  >
    <thead>
      <tr>
        <th>
          <FormattedMessage id="account" />
        </th>
        <th>
          <FormattedMessage id="payment" />
        </th>
        {compact === false && (
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
      {records.map(payment => (
        <Operation
          key={payment.id}
          compact={compact}
          op={payment}
          opURLFn={server.opURL}
          parentRenderTimestamp={parentRenderTimestamp}
        />
      ))}
    </tbody>
  </Table>
)

PaymentTable.propTypes = {
  compact: PropTypes.bool,
  parentRenderTimestamp: PropTypes.number,
  records: PropTypes.array.isRequired,
  server: PropTypes.object.isRequired,
}

const rspRecToPropsRec = record => {
  record.time = record.created_at
  return mapKeys(record, (v, k) => camelCase(k))
}

const fetchRecords = ({account, tx, limit, server}) => {
  const builder = server.payments()
  if (tx) builder.forTransaction(tx)
  if (account) builder.forAccount(account)
  builder.limit(limit)
  builder.order('desc')
  return builder.call()
}

const callBuilder = props => props.server.payments()

const enhance = compose(
  withPaging(),
  withDataFetchingContainer(fetchRecords, rspRecToPropsRec, callBuilder),
  withSpinner()
)

export default enhance(PaymentTable)
