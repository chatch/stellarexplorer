import { useLoaderData, useParams } from '@remix-run/react'
import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { FormattedMessage } from 'react-intl'
import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { CodeBlock } from '~/components/shared/CodeBlock'
import { loadContract } from '~/lib/stellar/contracts'
import { hexStringToBytes, setTitle } from '~/lib/utils'
import { saveAs } from '../../lib/filesaver'
import { requestToSorobanServer } from '~/lib/stellar/server'

interface CodeProps extends PropsWithChildren {
  wasmCode: string
  wasmCodeLedger: number
  decompiledCode: string
}

const saveWasmFile = (contractId: string, wasmHexString: string) =>
  saveAs(
    new Blob([hexStringToBytes(wasmHexString)], {
      type: 'application/octet-stream',
    }),
    `soroban-contract-${contractId}.wasm`,
    true, // don't insert a byte order marker
  )

const Code = ({
  contractId,
  wasmCode,
  decompiledCode,
  children,
}: CodeProps & { contractId: string }) => (
  <div id="wasm-code">
    <div>
      <button
        className="backend-resource-badge-button"
        onClick={() => saveWasmFile(contractId, wasmCode)}
        style={{ border: 0, marginTop: '10px' }}
      >
        <FormattedMessage id="contract.wasm.download" />
      </button>
    </div>
    {children}
    <CodeBlock code={decompiledCode} language="javascript" />
  </div>
)

export const contractCodeLoaderFn =
  (getCodeFn: Function) =>
  ({ params, request }: LoaderArgs) => {
    const server = requestToSorobanServer(request)
    return loadContract(server, params.contractId as string).then(
      async (result: any) => {
        if (!result) {
          return null
        }

        const { wasmCode, wasmCodeLedger } = result
        const decompiledCode = await getCodeFn(wasmCode)

        return json({ wasmCode, wasmCodeLedger, decompiledCode })
      },
    )
  }

export default function contractCodeTab(loader: Function) {
  return function CodeTab({ children }: PropsWithChildren) {
    const { contractId } = useParams()
    useEffect(() => {
      setTitle(`Contract Code ${contractId}`)
    }, [])

    const codeProps = useLoaderData<typeof loader>() as CodeProps | null

    if (!codeProps) {
      return <span>Code not found ...</span>
    }

    return (
      <Code {...codeProps} contractId={contractId as string}>
        {children}
      </Code>
    )
  }
}
