import React from 'react'
import {FormattedMessage} from 'react-intl'
import truncate from 'lodash/truncate'

import {xdr} from '../../lib/stellar'
import {
  scValToAddress,
  scvalToBigNumber,
} from '../../lib/stellar/xdr_scval_utils'

const invokeFunctionParamsRawtoRendered = (params) =>
  params.map((p) => {
    let renderStr
    let scVal = xdr.ScVal.fromXDR(p.value, 'base64')
    switch (p.type) {
      case 'Bytes':
        renderStr = scVal.bytes().toString('hex')
        break
      case 'Str':
        renderStr = scVal.str().toString()
        break
      case 'Address':
        renderStr = scValToAddress(scVal)
        break
      case 'Sym':
        renderStr = scVal.sym().toString()
        break
      case 'U32':
      case 'I32':
      case 'U64':
      case 'I64':
      case 'U128':
      case 'I128':
      case 'I256':
        renderStr = scvalToBigNumber(scVal).toNumber()
        break
      default:
        renderStr = p.value
    }
    return {type: p.type, value: renderStr}
  })

const renderContractParams = (
  params // : ReadonlyArray<Record<'type'|'value', string>>
) =>
  params.map(({type, value}) => (
    <div>
      &nbsp;&nbsp;&nbsp;&nbsp;{`  [${type}] `}
      <span title={value}>{truncate(value, {length: 60})}</span>
      {'\n'}
    </div>
  ))

const InvokeHostFunction = (props) => {
  const hostFn = props['hostFunctions'][0]
  if ('upload_wasm' === hostFn.type) {
    return (
      <FormattedMessage
        id="operation.invoke.host.function.upload-wasm"
        values={{
          type: hostFn.type,
          parameters: JSON.stringify(hostFn.parameters),
        }}
      />
    )
  } else if ('create_contract' === hostFn.type) {
    return (
      <div>
        <FormattedMessage
          id="operation.invoke.host.function.create-contract"
          values={{
            type: hostFn.type,
          }}
        />
        :
        {renderContractParams(
          hostFn.parameters.map((p) => ({type: p.type, value: p[Object.keys(p).filter(p=>p !== 'type')[0]]}))
        )}
      </div>
    )
  } else if ('invoke_contract' === hostFn.type) {
    return (
      <div>
        <FormattedMessage
          id="operation.invoke.host.function.invoke-contract"
          values={{
            type: hostFn.type,
          }}
        />
        :
        {renderContractParams(
          invokeFunctionParamsRawtoRendered(hostFn.parameters)
        )}
      </div>
    )
  }
  return <span>{hostFn.type}</span>
}

export default InvokeHostFunction
