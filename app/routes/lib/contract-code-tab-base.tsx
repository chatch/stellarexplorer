import { useLoaderData, useParams } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { CodeBlock } from '~/components/shared/CodeBlock'
import { loadContract } from '~/lib/stellar/contracts'
import { setTitle } from '~/lib/utils'
import { requestToSorobanServer } from '~/lib/stellar/server'

interface CodeProps extends PropsWithChildren {
  decompiledCode: string
  language?: string
}

const Code = ({
  decompiledCode,
  children,
  language = 'javascript',
}: CodeProps) => (
  <div id="wasm-code">
    {children}
    <CodeBlock code={decompiledCode} language={language} />
  </div>
)

export const contractCodeLoaderFn =
  (getCodeFn: Function) =>
  async ({ params, request }: LoaderFunctionArgs) => {
    const server = await requestToSorobanServer(request)
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

export default function contractCodeTab(loader: Function, language?: string) {
  return function CodeTab({ children }: PropsWithChildren) {
    const { contractId } = useParams()
    useEffect(() => {
      setTitle(`Contract Code ${contractId}`)
    }, [contractId])

    const codeProps = useLoaderData<typeof loader>() as CodeProps | null

    if (!codeProps) {
      return <span>Code not found ...</span>
    }

    return (
      <Code {...codeProps} language={language}>
        {children}
      </Code>
    )
  }
}
