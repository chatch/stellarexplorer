import { useLoaderData, useParams } from "@remix-run/react"
import { LoaderArgs, json } from "@remix-run/node"
import { FormattedMessage } from 'react-intl'
import { useEffect } from "react"
import truncate from 'lodash/truncate'

import { getContractDecompiled, loadContract } from "~/lib/stellar/contracts"
import { hexStringToBytes, setTitle } from "~/lib/utils"
import { saveAs } from '../lib/filesaver'
import { requestToSorobanServer } from "~/lib/stellar/server"

const Buffer = require('buffer').Buffer

interface CodeProps {
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
    true // don't insert a byte order marker
  )


const Code = ({
  contractId,
  wasmCode,
  wasmCodeLedger,
  decompiledCode
}: CodeProps & { contractId: string }) => (
  <div id="wasm-code">
    <div>{truncate(wasmCode, { length: 60 })}</div>
    <div>
      <button
        className="backend-resource-badge-button"
        onClick={() => saveWasmFile(contractId, wasmCode)}
        style={{ border: 0, marginTop: '10px' }}
      >
        <FormattedMessage id="contract.wasm.download" />
      </button>
    </div>
    <div>{decompiledCode}</div>
  </div>
)

export const loader = ({ params, request }: LoaderArgs) => {
  const server = requestToSorobanServer(request)
  return loadContract(
    server,
    params.contractId as string
  ).then(async (result: any) => {
    if (!result) {
      return null
    }

    const { wasmCode, wasmCodeLedger } = result
    const decompiledCode = await getContractDecompiled(wasmCode)

    return json({ wasmCode, wasmCodeLedger, decompiledCode })
  })
}

export default function CodeTab() {
  const { contractId } = useParams()
  useEffect(() => {
    setTitle(`Contract Code ${contractId}`)
  }, [])

  const codeProps = useLoaderData<typeof loader>() as CodeProps | null

  if (!codeProps) {
    return (<span>Code not found ...</span>)
  }

  return (
    <Code {...codeProps} contractId={contractId as string} />
  )
}