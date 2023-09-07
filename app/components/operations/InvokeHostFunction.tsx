import { FormattedMessage } from 'react-intl'
import truncate from 'lodash/truncate'

import { xdr } from '../../lib/stellar'
import {
  scValToAddress,
} from '../../lib/stellar/xdr_scval_utils'
import { scValToNative } from 'soroban-client'
import AccountLink from '../shared/AccountLink'

type HostFunctionParams = any // TODO: restore this after seeing live data: ReadonlyArray<Record<'key' | 'value' | 'type', string>>

const scValToString = (type: string, scVal: any) => {
  let str
  switch (type) {
    case 'Bytes':
      str = scVal.bytes().toString('hex')
      break
    case 'Str':
      str = scVal.str().toString()
      break
    case 'Address':
      str = scValToAddress(scVal)
      break
    case 'Sym':
      str = scVal.sym().toString()
      break
    case 'U32':
    case 'I32':
    case 'U64':
    case 'I64':
    case 'U128':
    case 'I128':
    case 'I256':
      str = String(scValToNative(scVal))
      break
    case '':
    case 'Void': // not seeing this yet but assuming it will be changed from '' to 'Void' at some point
      str = ''
      break
    // TODO: #513
    // case 'Map':
    //   const map = scVal.map()
    //   str = JSON.stringify(map)
    //   break
    default:
      str = undefined
  }
  return str
}

const invokeFunctionParamsRawtoRendered = (params: HostFunctionParams) =>
  params.map((p: any) => {
    let scVal = xdr.ScVal.fromXDR(p.value, 'base64')
    let renderStr = scValToString(p.type, scVal) || p.value
    return { key: p.type || 'Void', value: renderStr }
  })

const renderContractParams = (
  // params: HostFunctionParams
  params: any
) =>
  params.map(({ key, value }: { key: string, value: string }, idx: number) => (
    <span key={idx}>&nbsp;&nbsp;&nbsp;&nbsp;
      <span title={value}>{
        key === 'Address' ?
          <AccountLink account={value} /> :
          truncate(value, { length: 40 })
      }</span>
      &nbsp;&nbsp;<small><i>{`[${key}]`}</i></small>
      <br />
    </span>
  ))

interface InvokeHostFunctionProps {
  type: string
  parameters: ReadonlyArray<{ type: string, value: string }>
  function: string
  salt: string
}
const InvokeHostFunction = (props: InvokeHostFunctionProps) => {
  const {
    parameters,
    function: functionName,
  } = props
  if (`HostFunctionTypeHostFunctionTypeInvokeContract` === functionName) {
    return (
      <span>
        <FormattedMessage
          id="operation.invoke.host.function.invoke-contract"
        />
        <br />
        {parameters ? renderContractParams(
          invokeFunctionParamsRawtoRendered(parameters)
        ) : (<span>No parameters</span>)}
      </span>
    )
  } else if (`HostFunctionTypeHostFunctionTypeUploadContractWasm` === functionName) {
    return (
      <span>
        <FormattedMessage
          id="operation.invoke.host.function.upload-wasm"
        />
      </span>
    )
  } else if ('HostFunctionTypeHostFunctionTypeCreateContract' === functionName) {
    return (
      <span>
        <FormattedMessage
          id="operation.invoke.host.function.create-contract"
        />
        :<br />&nbsp;&nbsp;&nbsp;&nbsp;
        {parameters ? renderContractParams(
          parameters.map((p: any) => {
            const singleKey = Object.keys(p).filter((p) => p !== 'type')[0]
            return { key: singleKey, value: p[singleKey] }
          }))
          : (<span>No parameters</span>)}
      </span>
    )
  }
}

export default InvokeHostFunction
