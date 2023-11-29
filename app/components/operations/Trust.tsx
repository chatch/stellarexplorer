import type { PropsWithChildren } from 'react'
import AccountLink from '../shared/AccountLink'
import { FormattedMessage } from 'react-intl'

export interface TrustProps extends PropsWithChildren {
  assetCode: string
  trustee: string
}

const Trust = ({ assetCode, children, trustee }: TrustProps) => (
  <span>
    <FormattedMessage
      id="operation.trust"
      values={{
        assetCode,
        trustee: <AccountLink account={trustee} />,
      }}
    />
    {children}
  </span>
)

export default Trust
