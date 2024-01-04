import { useLoaderData, useParams } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useEffect } from 'react'
import Table from 'react-bootstrap/Table'

import type { StorageElement } from '~/lib/stellar/contracts'
import { getContractInfo } from '~/lib/stellar/contracts'
import { requestToSorobanServer } from '~/lib/stellar/server'
import { setTitle } from '~/lib/utils'
import AccountLink from '~/components/shared/AccountLink'

const Storage = ({ storage }: { storage: ReadonlyArray<StorageElement> }) => (
  <Table id="storage-table">
    <thead>
      <tr>
        <th>Key</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      {storage.map(({ key, keyType, value, valueType }) => (
        <tr key={key}>
          <td>
            <span>{key}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <small>
              <i>{`[${keyType.substring(3)}]`}</i>
            </small>
          </td>
          <td>
            <span title={valueType}>
              {value === 'scvAddress' ? <AccountLink account={value} /> : value}
            </span>
            &nbsp;&nbsp;
            <small>
              <i>{`[${valueType.substring(3)}]`}</i>
            </small>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
)

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const server = await requestToSorobanServer(request)
  return getContractInfo(server, params.contractId as string).then(
    async (result: any) => {
      if (!result) {
        return null
      }
      return json({ storage: result.storage })
    },
  )
}

export default function StorageTab() {
  const { contractId } = useParams()
  useEffect(() => {
    setTitle(`Contract Storage ${contractId}`)
  }, [contractId])

  const loadResult = useLoaderData<typeof loader>() as {
    storage: ReadonlyArray<StorageElement>
  } | null

  if (!loadResult || loadResult.storage.length == 0) {
    return <span>No storage</span>
  }

  return <Storage storage={loadResult.storage} />
}
