import AccountLink from '../shared/AccountLink'
import { FormattedMessage } from 'react-intl'

const AccountMerge = ({ into }: { into: string }) => (
  <FormattedMessage
    id="operation.account.merge"
    values={{
      account: <AccountLink account={into} />,
    }}
  />
)

export default AccountMerge
