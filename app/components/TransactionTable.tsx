import React from 'react'
import Table from 'react-bootstrap/Table'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import AccountLink from './shared/AccountLink'
import RelativeTime from './shared/RelativeTime'
import TransactionHash from './shared/TransactionHash'
import type { TransactionProps } from '~/routes/tx.$txHash'

interface TransactionViewOptions {
  showLedger?: boolean
  showSource?: boolean
}

interface ParentProps {
  compact: boolean
}

interface TransactionRowProps
  extends TransactionViewOptions,
    TransactionProps,
    ParentProps {}

interface TransactionTableProps extends ParentProps, TransactionViewOptions {
  records: ReadonlyArray<TransactionProps>
}

const TransactionRow = ({
  compact,
  hash,
  sourceAccount,
  ledger,
  opCount,
  showLedger,
  showSource,
  time,
}: TransactionRowProps): React.JSX.Element => (
  <tr>
    <td>
      <TransactionHash hash={hash} compact={compact} />
    </td>
    {showSource === true && (
      <td className="account-badge">
        <AccountLink account={sourceAccount} />
      </td>
    )}
    {showLedger === true && (
      <td>
        <Link to={`/ledger/${ledger}`}>{ledger}</Link>
      </td>
    )}
    <td>
      <Link to={`/tx/${hash}#operations-table`}>{opCount}</Link>
    </td>
    <td>
      <span title={time}>
        <RelativeTime timeStr={time} />
      </span>
    </td>
  </tr>
)

export default function TransactionTable({
  compact,
  records,
  showLedger = true,
  showSource = true,
}: TransactionTableProps) {
  return (
    <Table
      id="transaction-table"
      className="table-striped table-hover table-condensed"
    >
      <thead>
        <tr>
          <th>#</th>
          {showSource === true && (
            <th>
              <FormattedMessage id="source.account" />
            </th>
          )}
          {showLedger === true && (
            <th>
              <FormattedMessage id="ledger" />
            </th>
          )}
          <th>
            <FormattedMessage id={compact ? 'ops' : 'operations'} />
          </th>
          <th>
            <FormattedMessage id="time" />
          </th>
        </tr>
      </thead>
      <tbody>
        {records.map((tx) => (
          <TransactionRow
            key={tx.hash}
            compact={compact}
            showLedger={showLedger}
            showSource={showSource}
            {...tx}
          />
        ))}
      </tbody>
    </Table>
  )
}
