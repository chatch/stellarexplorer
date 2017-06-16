import React from 'react'
import {Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {FormattedTime, FormattedDate, FormattedMessage} from 'react-intl'

import {server as stellar} from '../lib/Stellar'
import {isDefInt, shortHash} from '../lib/Utils'
import {withSpinner} from './shared/HOCs'

const isLoading = (props) => (props.isLoading === true)

class AccountRow extends React.Component {
  render() {
    const txHash = this.props.hash
    return (
      <tr>
        <td>
          <span title={txHash}>
            <Link to={`/tx/${txHash}`}>{shortHash(txHash)}</Link>
          </span>
        </td>
        <td><FormattedDate value={this.props.time}/>
          <FormattedTime value={this.props.time}/></td>
        <td>{this.props.value}</td>
        <td>
          <Link to={`/ledger/${this.props.ledger}`}>{this.props.ledger}</Link>
        </td>
      </tr>
    )
  }
}

class AccountTable extends React.Component {
  renderRow(account) {
    return <AccountRow key={account.hash} {...account}/>
  }

  render() {
    return (
      <Table id="Account-table">
        <thead>
          <tr>
            <th>#</th>
            <th><FormattedMessage id="time"/></th>
            <th>Value</th>
            <th><FormattedMessage id="ledger"/></th>
          </tr>
        </thead>
        <tbody>{this.props.accounts.map(this.renderRow)}</tbody>
      </Table>
    )
  }
}

class AccountTableContainer extends React.Component {
  static DEFAULT_LIMIT = 5

  state = {
    accounts: [],
    isLoading: true
  }

  componentDidMount() {
    this.update()
    this.timerID = setInterval(() => this.update(), 15000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  accounts() {
    const limit = (isDefInt(this.props, 'limit'))
      ? this.props.limit
      : this.DEFAULT_LIMIT
    const builder = stellar.accounts()
    builder.limit(limit)
    builder.order('desc')
    return builder.call()
  }

  update() {
    this.accounts().then((result) => {
      this.setState({accounts: result.records.accounts, isLoading: false})
    }).catch((err) => {
      console.error(`Failed to fetch Accounts: [${err}]`)
      this.setState({accounts: [], isLoading: false})
    })
  }

  render() {
    return (<WrappedAccountTable accounts={this.state.accounts}/>)
  }
}
const WrappedAccountTable = withSpinner(isLoading)(AccountTable)

export default AccountTableContainer
