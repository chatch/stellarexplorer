import { useLoaderData, useParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import type { HorizonServerDetails } from '~/lib/stellar/server'
import HorizonServer from '~/lib/stellar/server'
import type { LoadAccountResult } from '~/lib/stellar/server_request_utils'
import { loadAccount } from '~/lib/stellar/server_request_utils'
import { base64Decode, setTitle } from '~/lib/utils'
import type { loader } from '../tx.$txHash'

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

const nameValueAccountTab = function (name: string) {
  return function () {
    const serverDetails = useLoaderData<typeof loader>() as HorizonServerDetails
    const [accountResult, setAccountResult]: [LoadAccountResult | null, any] =
      useState(null)
    const { accountId } = useParams()

    useEffect(() => {
      if (typeof window !== 'undefined') {
        setTitle(`Account ${name} ${accountId}`)
        const server = new HorizonServer(
          serverDetails.serverAddress,
          serverDetails.networkType as string,
        )
        loadAccount(server, accountId as string).then(setAccountResult)
      }
    }, [accountId])

    if (!accountResult) {
      return
    }

    return (
      <NameValueTable
        data={(accountResult as any).account[name.toLowerCase()]}
      />
    )
  }
}

export { nameValueAccountTab }
