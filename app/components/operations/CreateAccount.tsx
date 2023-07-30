import { FormattedMessage } from 'react-intl'
import AccountLink from '../shared/AccountLink'
import FormattedAmount from '../shared/FormattedAmount'

export interface CreateAccountProps {
  account: string
  startingBalance: string
}

const CreateAccount = ({ account, startingBalance }: CreateAccountProps) => (
  <FormattedMessage
    id="operation.account.create"
    values={{
      account: <AccountLink account={account} />,
      balance: <FormattedAmount amount={startingBalance} />,
    }}
  />
)

export default CreateAccount
