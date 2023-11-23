import type { PropsWithChildren } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import Asset from '../shared/Asset'
import AccountLink from '../shared/AccountLink'
import FormattedAmount from '../shared/FormattedAmount'

export interface PaymentProps extends PropsWithChildren {
  id: string
  amount: string
  assetCode: string
  assetIssuer: string
  assetType: string
  to: string
  toMuxed: string
  sourceAccount: string
  time: string
  pagingToken: string
}

export default function Payment({
  amount,
  assetCode,
  assetIssuer,
  assetType,
  children,
  to,
  toMuxed,
}: PaymentProps) {
  return (
    <span>
      <FormattedMessage
        id="operation.payment"
        values={{
          amount: <FormattedAmount amount={amount} />,
          asset: (
            <Asset code={assetCode} issuer={assetIssuer} type={assetType} />
          ),
          recipient: <AccountLink account={toMuxed ? toMuxed : to} />,
        }}
      />
      {children}
    </span>
  )
}
