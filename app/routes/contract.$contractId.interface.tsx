import { useLoaderData, useParams } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useEffect } from 'react'

import { getContractInterface, loadContract } from '~/lib/stellar/contracts'
import { requestToSorobanServer } from '~/lib/stellar/server'
import { setTitle } from '~/lib/utils'
import { CodeBlock } from '~/components/shared/CodeBlock'

const Interface = ({
  rustInterface, // jsonInterface,
}: {
  rustInterface: string
  // jsonInterface: string,
}) => (
  <div>
    <div id="cli-info">
      The Rust interface below was produced by the{' '}
      <a href="https://github.com/stellar/soroban-tools/blob/v20.0.0-rc2/docs/soroban-cli-full-docs.md#soroban-contract-bindings">
        soroban contract bindings
      </a>{' '}
      command.
    </div>
    <CodeBlock code={rustInterface} language="rust" />
    {/* <JSONPretty id="json-pretty" json={jsonInterface} /> */}
  </div>
)

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const server = await requestToSorobanServer(request)
  return loadContract(server, params.contractId as string)
    .then((result: any) => {
      if (!result) {
        return null
      }
      return getContractInterface(result.wasmCode)
    })
    .then(json)
}

export default function InterfaceTab() {
  const { contractId } = useParams()
  useEffect(() => {
    setTitle(`Contract Interface ${contractId}`)
  }, [contractId])

  const loadResult = useLoaderData<typeof loader>()

  if (!loadResult) {
    return <span>No interface or failed to get interface</span>
  }

  return (
    <Interface
      rustInterface={loadResult.rustInterface}
      // jsonInterface={loadResult.jsonInterface}
    />
  )
}
