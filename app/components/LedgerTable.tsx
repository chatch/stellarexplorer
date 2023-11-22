import React from 'react'
import Table from 'react-bootstrap/Table'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import RelativeTime from './shared/RelativeTime'
import type { LedgerProps } from '~/routes/ledger.$ledgerId'

interface ParentProps {
  compact: boolean
}

interface LedgerRowProps extends Partial<LedgerProps>, ParentProps {}

interface LedgerTableProps extends ParentProps {
  records: ReadonlyArray<LedgerProps>
}

const LedgerRow = ({
  sequence,
  successfulTransactionCount,
  failedTransactionCount,
  time,
  compact,
}: LedgerRowProps): React.JSX.Element => (
  <tr>
    <td>
      <Link to={`/ledger/${sequence}`}>{sequence}</Link>
    </td>
    <td>
      {successfulTransactionCount && successfulTransactionCount > 0 ? (
        <Link to={`/ledger/${sequence}#txs-table`}>
          {successfulTransactionCount}
        </Link>
      ) : (
        successfulTransactionCount
      )}
      {compact === false && <span> successful</span>} / {failedTransactionCount}
      {compact === false && <span> failed</span>}
    </td>
    <td>
      <span title={time}>{time && <RelativeTime timeStr={time} />}</span>
    </td>
  </tr>
)

export default function LedgerTable({ compact, records }: LedgerTableProps) {
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
        {records == null ? (
          <p> Loading ...</p>
        ) : (
          records.map((ledger: LedgerProps) => (
            <LedgerRow
              compact={compact}
              key={ledger.sequence}
              sequence={ledger.sequence}
              time={ledger.time}
              successfulTransactionCount={ledger.successfulTransactionCount}
              failedTransactionCount={ledger.failedTransactionCount}
            />
          ))
        )}
      </tbody>
    </Table>
  )
}
