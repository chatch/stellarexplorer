import React from 'react'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'
import AccountLink from '../shared/AccountLink'
import FormattedAmount from '../shared/FormattedAmount'

const CreateAccount = ({account, startingBalance}) => (
  <FormattedMessage
    id="operation.account.create"
    values={{
      account: <AccountLink account={account} />,
      balance: <FormattedAmount amount={startingBalance} />,
    }}
  />
)

CreateAccount.propTypes = {
  account: PropTypes.string.isRequired,
  startingBalance: PropTypes.string.isRequired,
}

export default CreateAccount
