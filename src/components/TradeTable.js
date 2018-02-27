import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import Table from 'react-bootstrap/lib/Table'
import {FormattedMessage} from 'react-intl'

import mapKeys from 'lodash/mapKeys'
import camelCase from 'lodash/camelCase'

import AccountLink from './shared/AccountLink'
import Asset from './shared/Asset'
import {withDataFetchingContainer} from './shared/DataFetchingContainer'
import {withPaging} from './shared/Paging'
import {withSpinner} from './shared/Spinner'
import TimeSynchronisedFormattedRelative from './shared/TimeSynchronizedFormattedRelative'

const Trade = ({trade, parentRenderTimestamp}) => {
  const Base = (
    <div>
      <AccountLink account={trade.baseAccount} /> {trade.baseAmount}{' '}
      <Asset
        code={trade.baseAssetCode}
        issuer={trade.baseAssetIssuer}
        type={trade.baseAssetType}
      />
    </div>
  )
  const Counter = (
    <div>
      <AccountLink account={trade.counterAccount} /> {trade.counterAmount}{' '}
      <Asset
        code={trade.counterAssetCode}
        issuer={trade.counterAssetIssuer}
        type={trade.counterAssetType}
      />
    </div>
  )
  return (
    <tr key={trade.id} className="trade">
      <td>{trade.baseIsSeller ? Base : Counter}</td>
      <td>{trade.baseIsSeller ? Counter : Base}</td>
      <td>
        <span title={trade.time}>
          <TimeSynchronisedFormattedRelative
            initialNow={parentRenderTimestamp}
            value={trade.time}
          />
        </span>
      </td>
    </tr>
  )
}

const TradeTable = ({compact, server, parentRenderTimestamp, records}) => (
  <Table id="trade-table" className="table-striped table-hover table-condensed">
    <thead>
      <tr>
        <th>
          <FormattedMessage id="Sell" />
        </th>
        <th>
          <FormattedMessage id="Buy" />
        </th>
        <th>
          <FormattedMessage id="time" />
        </th>
        <th />
      </tr>
    </thead>
    <tbody>
      {records.map(trade => (
        <Trade
          key={trade.id}
          compact={compact}
          trade={trade}
          parentRenderTimestamp={parentRenderTimestamp}
        />
      ))}
    </tbody>
  </Table>
)

TradeTable.propTypes = {
  compact: PropTypes.bool,
  parentRenderTimestamp: PropTypes.number,
  records: PropTypes.array.isRequired,
  server: PropTypes.object.isRequired,
}

const rspRecToPropsRec = record => {
  record.time = record.ledger_close_time
  return mapKeys(record, (v, k) => camelCase(k))
}

const fetchRecords = ({account, limit, server}) => {
  const builder = server.trades()
  if (account) builder.forAccount(account)
  builder.limit(limit)
  builder.order('desc')
  return builder.call()
}

const callBuilder = props => props.server.trades()

const enhance = compose(
  withPaging(),
  withDataFetchingContainer(fetchRecords, rspRecToPropsRec, callBuilder),
  withSpinner()
)

export default enhance(TradeTable)
