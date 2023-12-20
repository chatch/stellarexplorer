import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'
import { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { requestToServer } from '~/lib/stellar/server'
import type { LoadAccountResult } from '~/lib/stellar/server_request_utils'
import { loadAccount } from '~/lib/stellar/server_request_utils'
import { base64Decode, setTitle } from '~/lib/utils'

const dataValue = (decodeValue: boolean, value?: any): string => {
  let retVal
  if (typeof value === 'boolean') {
    retVal = value.toString()
  } else if (decodeValue) {
    retVal = base64Decode(value)
  } else {
    retVal = value
  }
  return retVal
}

const NameValueTable = ({
  data,
  decodeValue = false,
}: {
  data: Record<string, any>
  decodeValue?: boolean
}) => {
  if (!data || Object.keys(data).length === 0)
    return <div style={{ marginTop: 20, marginBottom: 20 }}>No Data</div>
  return (
    <Table id="data-table">
      <thead>
        <tr>
          <th>
            <FormattedMessage id="name" />
          </th>
          <th>
            <FormattedMessage id="value" />
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(data).map((key) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{dataValue(decodeValue, data[key])}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

const nameValueLoader = async ({ params, request }: LoaderArgs) => {
  const server = await requestToServer(request)
  return loadAccount(server, params.accountId as string).then(json)
}

const nameValueAccountTab = function (name: string) {
  return function () {
    const accountResult = useLoaderData<
      typeof nameValueLoader
    >() as LoadAccountResult

    const { accountId } = useParams()
    useEffect(() => {
      setTitle(`Account ${name} ${accountId}`)
    })

    if (!accountResult) {
      return
    }

    return (
      <NameValueTable
        data={(accountResult.account as any)[name.toLowerCase()]}
      />
    )
  }
}

export { nameValueAccountTab, nameValueLoader }
