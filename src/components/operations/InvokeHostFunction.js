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
    return {key: p.type, value: renderStr}
  })

const renderContractParams = (
  params // : ReadonlyArray<Record<'key'|'value', string>>
) =>
  params.map(({key, value}, idx) => (
    <span key={idx}>
      &nbsp;&nbsp;&nbsp;&nbsp;{`  (${key}) `}
      <span title={value}>{truncate(value, {length: 60})}</span>
      <br/>
    </span>
  ))

const InvokeHostFunction = (props) => {
  const hostFn = props['hostFunctions'][0]
  if ('upload_wasm' === hostFn.type) {
    // TODO: render parameters [hostFn.parameters] but havn't yet seen an op that has any ...
    return (
      <FormattedMessage
        id="operation.invoke.host.function.upload-wasm"
        values={{
          type: hostFn.type,
        }}
      />
    )
  } else if ('create_contract' === hostFn.type) {
      return (
          <span>
        <FormattedMessage
          id="operation.invoke.host.function.create-contract"
          values={{
              type: hostFn.type,
            }}
            />
        :<br/>
        {renderContractParams(
            hostFn.parameters.map((p) => {
              const singleKey = Object.keys(p).filter(p=>p !== 'type')[0]
            return ({key: singleKey, value: p[singleKey]})
            })
        )}
      </span>
    )
  } else if ('invoke_contract' === hostFn.type) {
    return (
      <span>
        <FormattedMessage
          id="operation.invoke.host.function.invoke-contract"
          values={{
            type: hostFn.type,
          }}
        />
        :<br/>
        {renderContractParams(
          invokeFunctionParamsRawtoRendered(hostFn.parameters)
        )}
      </span>
    )
  }
  return <span>{hostFn.type}</span>
}

export default InvokeHostFunction
