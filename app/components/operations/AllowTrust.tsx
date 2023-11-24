import { FormattedMessage } from 'react-intl'
import AccountLink from '../shared/AccountLink'
import type { TrustProps } from './Trust'
import Trust from './Trust'

export interface AllowTrustProps extends TrustProps {
  authorize: string
  trustor: string
}

const AllowTrust = (props: AllowTrustProps) => (
  <Trust {...props}>
    <FormattedMessage
      id="operation.trust.allow"
      values={{
        authorize: String(props.authorize),
        trustor: <AccountLink account={props.trustor} />,
      }}
    />
  </Trust>
)

export default AllowTrust
