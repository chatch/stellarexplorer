import { LoaderArgs, json } from "@remix-run/node"
import { useLoaderData, useParams } from "@remix-run/react"
import { useEffect } from "react"
import { Table } from "react-bootstrap"
import { FormattedMessage } from "react-intl"
import { Horizon } from "stellar-sdk"
import Asset from "~/components/shared/Asset"
import FormattedAmount from "~/components/shared/FormattedAmount"
import { requestToServer } from "~/lib/stellar/server"
import { LoadAccountResult, loadAccount } from "~/lib/stellar/server_request_utils"
import { setTitle } from "~/lib/utils"

type Balance = Pick<Horizon.BalanceLineAsset,
  'asset_code' |
  'asset_issuer' |
  'asset_type' |
  'balance' |
  'limit'
>

const balanceRow = ({
  asset_code,
  asset_issuer,
  asset_type,
  balance,
  limit,
}: Balance) => (
  <tr key={asset_code ? `${asset_code}-${asset_issuer}` : "XLM"}>
    <td>
      <Asset
        type={asset_type}
        code={asset_code}
        issuer={asset_issuer}
      />
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

export const loader = ({ params, request }: LoaderArgs) => {
  const server = requestToServer(request)
  return loadAccount(server, params.accountId as string).then(json)
}

export default function BalancesTab() {
  const accountResult =
    useLoaderData<typeof loader>() as LoadAccountResult

  const { accountId } = useParams()
  useEffect(() => {
    setTitle(`Account Balances ${accountId}`)
  }, [])

  if (!accountResult) {
    return
  }

  const balances = accountResult.account.balances as ReadonlyArray<Balance>
  console.log(balances)
  return (
    <Balances balances={balances} />
  )
}