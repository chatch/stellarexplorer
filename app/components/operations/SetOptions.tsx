import snakeCase from 'lodash/snakeCase'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { StrKey } from 'stellar-sdk'

import AccountLink from '../shared/AccountLink'
import { isPublicKey } from '../../lib/stellar/utils'
import { shortHash } from '../../lib/utils'

export interface SetOptionsProps {
  homeDomain: string
  signerKey: string
  signerWeight: number
  masterKeyWeight: number
  inflationDest: string
  setFlagsS: ReadonlyArray<string>
  clearFlagsS: ReadonlyArray<string>
  lowThreshold: number
  medThreshold: number
  highThreshold: number
}

const SET_OPTION_PROP_STRINGS = [
  'homeDomain',
  'signerKey',
  'signerWeight',
  'masterKeyWeight',
  'inflationDest',
  'setFlagsS',
  'clearFlagsS',
  'lowThreshold',
  'medThreshold',
  'highThreshold',
]

const dotCase = (str: string): string => snakeCase(str).replace('_', '.')

const Option = ({
  msgId,
  value,
}: {
  msgId: string
  value: React.JSX.Element
}) => {
  return (
    <FormattedMessage
      id={`operation.options.set.${msgId}`}
      values={{
        value,
      }}
    />
  )
}

const OptionValue = ({
  optKey,
  value,
}: {
  optKey: string
  value: string | ReadonlyArray<string> | number
}): React.JSX.Element => {
  const valueStr = String(value)
  let valueEl = <span>{valueStr}</span>
  if (value instanceof Array) {
    valueEl = <span>{value.join(', ')}</span>
  } else if (
    (optKey === 'signerKey' && isPublicKey(valueStr)) ||
    optKey === 'inflationDest'
  ) {
    valueEl = <AccountLink account={valueStr} />
  } else if (optKey === 'signerKey') {
    console.log(`decodePreAuthTx valueStr: ${valueStr}`)
    // and !isPublicKey (#19)
    const decodedValue = valueStr.startsWith('X')
      ? StrKey.decodeSha256Hash(valueStr).toString('hex')
      : StrKey.decodePreAuthTx(valueStr).toString('hex')
    valueEl = <span title={decodedValue}>{shortHash(decodedValue)}</span>
  } else if (optKey === 'homeDomain') {
    valueEl = <a href={`http://${valueStr}`}>{value}</a>
  }
  return <span>{valueEl}</span>
}

const OptionsList = (
  props: any, // TODO: restore SetOptionsProps
): React.JSX.Element => (
  <span>
    {Object.keys(props)
      .filter((p) => SET_OPTION_PROP_STRINGS.includes(p))
      .map((prop: string, idx: number, all) => {
        const propVal: string | number | ReadonlyArray<string> = props[
          prop
        ] as string
        return (
          <span key={prop}>
            <Option
              msgId={dotCase(prop)}
              value={<OptionValue optKey={prop} value={propVal} />}
            />
            {idx < all.length - 1 && ', '}
          </span>
        )
      })}
  </span>
)

const SetOptions = (props: SetOptionsProps) => (
  <FormattedMessage
    id="operation.options.set"
    values={{
      options: <OptionsList {...props} />,
    }}
  />
)

export default SetOptions
