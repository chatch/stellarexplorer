import { useLoaderData, useParams } from "@remix-run/react"
import { LoaderArgs, json } from "@remix-run/node"
import { useEffect } from "react"

import { xdr } from '~/lib/stellar'
import { getContractInfo } from "~/lib/stellar/contracts"
import { requestToSorobanServer } from "~/lib/stellar/server"
import { setTitle } from "~/lib/utils"

const Storage = ({ storage }: { storage: ReadonlyArray<xdr.ScMapEntry> }) => (
  <div id="contract-storage">
    {storage.map(s => (
      <div>{JSON.stringify(s)}</div>
    ))}
  </div>
)

export const loader = ({ params, request }: LoaderArgs) => {
  const server = requestToSorobanServer(request)
  return getContractInfo(
    server,
    params.contractId as string
  ).then(async (result: any) => {
    if (!result) {
      return null
    }
    return json({ storage: result.storage })
  })
}

export default function StorageTab() {
  const { contractId } = useParams()
  useEffect(() => {
    setTitle(`Contract Storage ${contractId}`)
  }, [])

  const loadResult = useLoaderData<typeof loader>() as
    { storage: ReadonlyArray<xdr.ScMapEntry> } | null

  if (!loadResult) {
    return (<span>No storage</span>)
  }

  return (
    <Storage storage={loadResult.storage} />
  )
}