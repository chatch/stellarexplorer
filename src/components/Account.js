import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Table from 'react-bootstrap/lib/Table'
import Tab from 'react-bootstrap/lib/Tab'
import Tabs from 'react-bootstrap/lib/Tabs'

import {injectIntl, FormattedMessage} from 'react-intl'

import StellarSdk from 'stellar-sdk'

import anchors from '../lib/anchors'
import {
  handleFetchDataFailure,
  isPublicKey,
  isStellarAddress,
} from '../lib/utils'
import {withServer} from './shared/HOCs'
import {withSpinner} from './shared/Spinner'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

import AccountLink from './shared/AccountLink'
import AnchorLogo from './shared/AnchorLogo'
import Asset from './shared/Asset'
import OperationList from './OperationList'
import TransactionTable from './TransactionTableContainer'

const NameValueTable = ({data}) => {
  if (!data || Object.keys(data).length === 0) return <div>No Data</div>
  return (
    <Table>
      <thead>
        <tr>
          <th>
            <FormattedMessage id="name" />
          </th>
          <th>
            <FormattedMessage id="value" />
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(data).map(key =>
          <tr key={key}>
            <td>
              {key}
            </td>
            <td>
              {typeof data[key] === 'boolean'
                ? data[key].toString()
                : data[key]}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  )
}

const balanceRow = bal =>
  <tr key={bal.asset_code ? bal.asset_code : 'XLM'}>
    <td>
      <Asset
        type={bal.asset_type}
        code={bal.asset_code}
        issuer={bal.asset_issuer}
      />
    </td>
    <td>
      {bal.balance}
    </td>
    <td>
      {bal.limit}
    </td>
  </tr>

const Balances = props =>
  <Table>
    <thead>
      <tr>
        <th>
          <FormattedMessage id="asset" />
        </th>
        <th>
          <FormattedMessage id="balance" />
        </th>
        <th>
          <FormattedMessage id="limit" />
        </th>
      </tr>
    </thead>
    <tbody>
      {props.balances.map(balanceRow)}
    </tbody>
  </Table>

const Thresholds = props =>
  <Table>
    <thead>
      <tr>
        <th>
          <FormattedMessage id="threshold.low" />
        </th>
        <th>
          <FormattedMessage id="threshold.medium" />
        </th>
        <th>
          <FormattedMessage id="threshold.high" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          {props.thresholds.low_threshold}
        </td>
        <td>
          {props.thresholds.med_threshold}
        </td>
        <td>
          {props.thresholds.high_threshold}
        </td>
      </tr>
    </tbody>
  </Table>

const Signers = props =>
  <Table>
    <thead>
      <tr>
        <th>
          <FormattedMessage id="key" />
        </th>
        <th>
          <FormattedMessage id="weight" />
        </th>
        <th>
          <FormattedMessage id="type" />
        </th>
      </tr>
    </thead>
    <tbody>
      {props.signers.map(signer =>
        <tr key={signer.public_key}>
          <td>
            <AccountLink account={signer.public_key} />
          </td>
          <td>
            {signer.weight}
          </td>
          <td>
            {signer.type}
          </td>
        </tr>
      )}
    </tbody>
  </Table>

const Flags = ({flags}) => <NameValueTable data={flags} />
const Data = ({data}) => <NameValueTable data={data} />

const Anchor = ({anchor}) =>
  <div>
    {anchor.img ? <AnchorLogo anchor={anchor} /> : anchor.name}
  </div>

const stellarAddressFromURI = () => {
  if (!window || !window.location || !window.location.pathname) return
  const path = window.location.pathname
  const lastPath = path.substring(path.lastIndexOf('/') + 1)
  return isStellarAddress(lastPath) ? lastPath : undefined
}

class Account extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    const a = this.props.account
    const header = titleWithJSONButton(
      a.id,
      formatMessage({id: 'account'}),
      this.props.urlFn
    )
    const stellarAddr = stellarAddressFromURI()
    return (
      <Grid>
        <Row>
          <Panel header={header}>
            {anchors.hasOwnProperty(a.id) &&
              <Anchor id={a.id} anchor={anchors[a.id]} />}
            <h4>
              <FormattedMessage id="key.public" />
            </h4>
            <span>
              {a.id}
            </span>

            {stellarAddr &&
              <span>
                <h4>
                  <FormattedMessage id="stellar.address" />
                </h4>
                {stellarAddr}
              </span>}
          </Panel>
        </Row>
        <Row>
          <Tabs
            defaultActiveKey={1}
            id="account-tabs"
            style={{border: '1px solid #ddd', borderRadius: 4}}
          >
            <Tab eventKey={1} title={formatMessage({id: 'balances'})}>
              <Balances balances={a.balances} />
            </Tab>
            <Tab eventKey={2} title={formatMessage({id: 'operations'})}>
              <OperationList
                key={a.id}
                account={a.id}
                compact={false}
                limit={20}
                usePaging
              />
            </Tab>
            <Tab eventKey={3} title={formatMessage({id: 'transactions'})}>
              <TransactionTable
                key={a.id}
                account={a.id}
                compact={false}
                limit={10}
                usePaging
              />
            </Tab>
            <Tab eventKey={4} title={formatMessage({id: 'signing'})}>
              <Signers signers={a.signers} />
            </Tab>
            <Tab eventKey={5} title={formatMessage({id: 'thresholds'})}>
              <Thresholds thresholds={a.thresholds} />
            </Tab>
            <Tab eventKey={6} title={formatMessage({id: 'flags'})}>
              <Flags flags={a.flags} />
            </Tab>
            <Tab eventKey={7} title={formatMessage({id: 'data'})}>
              <Data data={a.data_attr} />
            </Tab>
          </Tabs>
        </Row>
      </Grid>
    )
  }
}
const AccountWithSpinner = withSpinner()(Account)

class AccountContainer extends React.Component {
  state = {
    account: null,
    isLoading: true,
  }

  componentDidMount() {
    this.loadAccount(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    this.loadAccount(nextProps.match.params.id)
  }

  loadAccount(accountId) {
    if (isPublicKey(accountId)) this.loadAccountByKey(accountId)
    else if (isStellarAddress(accountId))
      this.loadAccountByStellarAddress(accountId)
    else
      handleFetchDataFailure(accountId)(
        new Error(`Unrecognized account: ${accountId}`)
      )
  }

  loadAccountByStellarAddress(stellarAddr) {
    const [name, domain] = stellarAddr.split('*')
    StellarSdk.FederationServer
      .createForDomain(domain)
      .then(fed => fed.resolveAddress(name))
      .then(acc => this.loadAccount(acc.account_id))
      .catch(handleFetchDataFailure(stellarAddr))
  }

  loadAccountByKey(accountId) {
    this.props.server
      .accounts()
      .accountId(accountId)
      .call()
      .then(res => {
        this.setState({account: res, isLoading: false})
        return null
      })
      .catch(handleFetchDataFailure(accountId))
  }

  render() {
    return (
      <AccountWithSpinner
        account={this.state.account}
        isLoading={this.state.isLoading}
        urlFn={this.props.server.accountURL}
        {...this.props}
      />
    )
  }
}

export default injectIntl(withServer(AccountContainer))
