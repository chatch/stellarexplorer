import React from 'react'
import Table from 'react-bootstrap/Table'
import { FormattedMessage } from 'react-intl'

import AccountLink from './shared/AccountLink'
import FormattedAmount from './shared/FormattedAmount'
import Asset from './shared/Asset'
import RelativeTime from './shared/RelativeTime'

import { isPublicKey } from '../lib/stellar/utils'

export interface TradeProps {
  id: string
  baseIsSeller: boolean

  baseAccount?: string
  baseAssetCode: string
  baseAssetIssuer: string
  baseAssetType: string
  baseAmount: string

  counterAccount?: string
  counterAssetCode: string
  counterAssetIssuer: string
  counterAssetType: string
  counterAmount: string

  time: string
  pagingToken: string
}

interface TradeComponentProps {
  trade: TradeProps
  account: string
  singleAccountView: boolean
}

interface TradeTableProps {
  records: ReadonlyArray<TradeProps>
  account?: string
  accountView?: boolean
}

const Trade = ({ account, singleAccountView, trade }: TradeComponentProps) => {
  const Base = (
    <span>
      <FormattedAmount amount={trade.baseAmount} />{' '}
      <Asset
        code={trade.baseAssetCode}
        issuer={trade.baseAssetIssuer}
        type={trade.baseAssetType}
      />
    </span>
  )

  const Counter = (
    <span>
      <FormattedAmount amount={trade.counterAmount} />{' '}
      <Asset
        code={trade.counterAssetCode}
        issuer={trade.counterAssetIssuer}
        type={trade.counterAssetType}
      />
    </span>
  )

  let baseFirst
  let account1, account2

  if (singleAccountView) {
    const accountIsBase = account === trade.baseAccount
    baseFirst = !accountIsBase // account's bought asset first
    account1 = account
    account2 = accountIsBase ? trade.counterAccount : trade.baseAccount
  } else {
    baseFirst = trade.baseIsSeller
    account1 = trade.baseAccount
    account2 = trade.counterAccount
  }

  return (
    <tr key={trade.id} className="trade">
      <td>
        {account1 && (
          <span className="account-badge">
            <AccountLink account={account1} />
          </span>
        )}
      </td>
      <td>{baseFirst ? Base : Counter}</td>
      <td>
        {account2 && (
          <span className="account-badge">
            <AccountLink account={account2} />
          </span>
        )}
      </td>
      <td>{baseFirst ? Counter : Base}</td>
      <td>
        <span title={trade.time}>
          <RelativeTime timeStr={trade.time} />
        </span>
      </td>
    </tr>
  )
}

export default function TradeTable({ account, records }: TradeTableProps) {
  // componentDidMount() {
  //   if (this.props.page === 0 && this.props.records.length < this.props.limit) {
  //     this.props.hidePagingFn()
  //   }
  // }
  if (records.length === 0)
    return <div style={{ marginTop: 20, marginBottom: 20 }}>No Trades</div>

  const singleAccountView = isPublicKey(account)

  return (
    <div>
      <Table
        id="trade-table"
        className="table-striped table-hover table-condensed"
      >
        <thead>
          <tr>
            <th>
              <FormattedMessage id="account" />
              {' 1'}
            </th>
            <th>
              <FormattedMessage id="bought" />
            </th>
            <th>
              <FormattedMessage id="account" />
              {' 2'}
            </th>
            <th>
              <FormattedMessage id="bought" />
            </th>
            <th>
              <FormattedMessage id="time" />
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((trade) => (
            <Trade
              key={trade.id}
              trade={trade}
              account={account ?? ''}
              singleAccountView={singleAccountView}
            />
          ))}
        </tbody>
      </Table>
      {/* <div className="text-center" id="csv-export">
          <ExportToCSVComponent account={account} server={server} />
        </div> */}
    </div>
  )
}
