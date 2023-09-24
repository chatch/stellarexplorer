import { useLoaderData, useParams } from "@remix-run/react"
import { LoaderArgs, json } from "@remix-run/node"
import { PropsWithChildren, useEffect } from "react"

import { CodeBlock } from "~/components/shared/CodeBlock"
import { loadContract } from "~/lib/stellar/contracts"
import { setTitle } from "~/lib/utils"
import { requestToSorobanServer } from "~/lib/stellar/server"

interface CodeProps extends PropsWithChildren {
  wasmCode: string
  wasmCodeLedger: number
  decompiledCode: string
}

const Code = ({
  decompiledCode,
  children
}: CodeProps) => (
  <div id="wasm-code">
    {children}
    <CodeBlock
      code={decompiledCode}
      language="C"
    />
  </div>
)

export const contractCodeLoaderFn = (getCodeFn: Function) => ({ params, request }: LoaderArgs) => {
  const server = requestToSorobanServer(request)
  return loadContract(
    server,
    params.contractId as string
  ).then(async (result: any) => {
    if (!result) {
      return null
    }

    const { wasmCode, wasmCodeLedger } = result
    const decompiledCode = await getCodeFn(wasmCode)

    return json({ wasmCode, wasmCodeLedger, decompiledCode })
  })
}

export default function contractCodeTab(loader: Function) {
  return function CodeTab({ children }: PropsWithChildren) {
    const { contractId } = useParams()
    useEffect(() => {
      setTitle(`Contract Code ${contractId}`)
    }, [])

    const codeProps = useLoaderData<typeof loader>() as CodeProps | null

    if (!codeProps) {
      return (<span>Code not found ...</span>)
    }

    return (
      <Code {...codeProps}>{children}</Code>
    )
  }
}