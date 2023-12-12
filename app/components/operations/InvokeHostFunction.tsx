import { FormattedMessage } from 'react-intl'
import truncate from 'lodash/truncate'

import { xdr } from '../../lib/stellar'
import { scValToString } from '../../lib/stellar/xdr_scval_utils'
import AccountLink from '../shared/AccountLink'

type HostFunctionParams = any // TODO: restore this after seeing live data: ReadonlyArray<Record<'key' | 'value' | 'type', string>>

const invokeFunctionParamsRawtoRendered = (params: HostFunctionParams) =>
  params.map((p: any) => {
    let scVal = xdr.ScVal.fromXDR(p.value, 'base64')
    let renderStr = scValToString(scVal) || p.value
    return { key: p.type || 'Void', value: renderStr }
  })

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
              const singleKey = Object.keys(p).filter((p) => p !== 'type')[0]
              return { key: singleKey, value: p[singleKey] }
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
