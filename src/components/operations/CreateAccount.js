import React from 'react'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'
import AccountLink from '../shared/AccountLink'

const CreateAccount = ({account, startingBalance}) =>
  <span>
    Created <FormattedMessage id="account" />{' '}
    <AccountLink account={account} /> with Balance{' '}
    {startingBalance}
  </span>

CreateAccount.propTypes = {
  account: PropTypes.string.isRequired,
  startingBalance: PropTypes.number,
}

export default CreateAccount
