import { FormattedMessage } from 'react-intl'
import truncate from 'lodash/truncate'

import { xdr } from '../../lib/stellar'
import { scValToString } from '../../lib/stellar/xdr_scval_utils'
import AccountLink from '../shared/AccountLink'

type HostFunctionParams = any // TODO: restore this after seeing live data: ReadonlyArray<Record<'key' | 'value' | 'type', string>>

const invokeFunctionParamsRawtoRendered = (params: HostFunctionParams) => {
  if (!Array.isArray(params)) return []
  return params.map((p: any) => {
    try {
      if (!p.value) {
        return { key: p.type || 'Void', value: 'No value' }
      }
      const scVal = xdr.ScVal.fromXDR(p.value, 'base64')
      const renderStr = scValToString(scVal) || p.value
      return { key: p.type || 'Void', value: renderStr }
    } catch (e) {
      console.error('Failed to parse ScVal:', e)
      return { key: p.type || 'Error', value: p.value || 'Invalid' }
    }
  })
}

const renderContractParams = (
  // params: HostFunctionParams
  params: any,
) =>
  params.map(({ key, value }: { key: string; value: string }, idx: number) => (
    <span key={idx} className="invoke-param">
      <span title={value}>
        {key === 'Address' ? (
          <AccountLink account={value} />
        ) : (
          truncate(value, { length: 40 })
        )}
      </span>
      &nbsp;&nbsp;
      <small>
        <i>{`[${key}]`}</i>
      </small>
      <br />
    </span>
  ))

interface InvokeHostFunctionProps {
  type: string
  parameters: ReadonlyArray<{ type: string; value: string }>
  function: string
  salt: string
}
const InvokeHostFunction = (props: InvokeHostFunctionProps) => {
  const { parameters, function: functionName } = props
  if ('HostFunctionTypeHostFunctionTypeInvokeContract' === functionName) {
    return (
      <span>
        <FormattedMessage id="operation.invoke.host.function.invoke-contract" />
        <br />
        {parameters ? (
          renderContractParams(invokeFunctionParamsRawtoRendered(parameters))
        ) : (
          <span>No parameters</span>
        )}
      </span>
    )
  } else if (
    'HostFunctionTypeHostFunctionTypeUploadContractWasm' === functionName
  ) {
    return (
      <span>
        <FormattedMessage id="operation.invoke.host.function.upload-wasm" />
      </span>
    )
  } else if (
    'HostFunctionTypeHostFunctionTypeCreateContract' === functionName
  ) {
    return (
      <span>
        <FormattedMessage id="operation.invoke.host.function.create-contract" />
        :<br />
        &nbsp;&nbsp;&nbsp;&nbsp;
        {parameters ? (
          renderContractParams(
            parameters.map((p: any) => {
              if (!p || typeof p !== 'object') {
                return { key: 'Unknown', value: String(p) }
              }
              const keys = Object.keys(p).filter((k) => k !== 'type')
              const singleKey = keys.length > 0 ? keys[0] : 'Unknown'
              return { key: singleKey, value: String(p[singleKey] || '') }
            }),
          )
        ) : (
          <span>No parameters</span>
        )}
      </span>
    )
  }
}

export default InvokeHostFunction
