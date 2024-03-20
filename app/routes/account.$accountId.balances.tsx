import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import type { HorizonApi } from 'stellar-sdk/lib/horizon'
import Asset from '~/components/shared/Asset'
import FormattedAmount from '~/components/shared/FormattedAmount'
import type { HorizonServerDetails } from '~/lib/stellar/server'
import HorizonServer, { requestToServerDetails } from '~/lib/stellar/server'
import type { LoadAccountResult } from '~/lib/stellar/server_request_utils'
import { loadAccount } from '~/lib/stellar/server_request_utils'
import { setTitle } from '~/lib/utils'

type Balance = Pick<
  HorizonApi.BalanceLineAsset,
  'asset_code' | 'asset_issuer' | 'asset_type' | 'balance' | 'limit'
>

const balanceRow = ({
  asset_code,
  asset_issuer,
  asset_type,
  balance,
  limit,
}: Balance) => (
  <tr key={asset_code ? `${asset_code}-${asset_issuer}` : 'XLM'}>
    <td>
      <Asset type={asset_type} code={asset_code} issuer={asset_issuer} />
    </td>
    <td>
      <span className="break">
        <FormattedAmount amount={balance} />
      </span>
    </td>
    <td>
      <span className="break">{limit}</span>
    </td>
  </tr>
)

const Balances = ({ balances }: { balances: ReadonlyArray<Balance> }) => (
  <Table id="balance-table">
    <thead>
      <tr>
        <th>
          <FormattedMessage id="asset" />
        </th>
        <th>
          <FormattedMessage id="balance" />
        </th>
        <th>
          <FormattedMessage id="limit" />
        </th>
      </tr>
    </thead>
    <tbody>{balances.map(balanceRow)}</tbody>
  </Table>
)

export const loader = ({ request }: LoaderFunctionArgs) =>
  requestToServerDetails(request)

export default function BalancesTab() {
  const serverDetails = useLoaderData<typeof loader>() as HorizonServerDetails
  const { accountId } = useParams()
  const [accountResult, setAccountResult]: [LoadAccountResult | null, any] =
    useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTitle(`Account Balances ${accountId}`)

      const server = new HorizonServer(
        serverDetails.serverAddress,
        serverDetails.networkType as string,
      )
      loadAccount(server, accountId as string)
        .then(json)
        .then(setAccountResult)
    }
  }, [accountId])

  if (!accountResult) {
    return
  }

  const balances = (accountResult as LoadAccountResult).account
    .balances as ReadonlyArray<Balance>

  return <Balances balances={balances} />
}
