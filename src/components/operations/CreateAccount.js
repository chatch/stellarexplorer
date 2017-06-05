import React from 'react'
import {Table} from 'react-bootstrap'
import {FormattedMessage} from 'react-intl'
import AccountLink from '../shared/AccountLink'

class CreateAccount extends React.Component {
  render() {
    const d = this.props.data
    return (
      <Table>
        <tbody>
          <tr>
            <td><FormattedMessage id="account"/></td>
            <td>
              <AccountLink account={d.account}/>
            </td>
          </tr>
          <tr>
            <td>Funder</td>
            <td>
              <AccountLink account={d.funder}/>
            </td>
          </tr>
          <tr>
            <td>Starting Balance</td>
            <td>{d.starting_balance}</td>
          </tr>
        </tbody>
      </Table>
    )
  }
}

export default CreateAccount
