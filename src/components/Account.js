import React from 'react'
import Col from 'react-bootstrap/lib/Col'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Table from 'react-bootstrap/lib/Table'
import Tab from 'react-bootstrap/lib/Tab'
import Tabs from 'react-bootstrap/lib/Tabs'
import {injectIntl, FormattedMessage} from 'react-intl'
import {FederationServer, StrKey} from 'stellar-sdk'
import has from 'lodash/has'

import knownAccounts from '../data/known_accounts'
import {
  base64Decode,
  handleFetchDataFailure,
  isPublicKey,
  isStellarAddress,
} from '../lib/utils'
import {withServer} from './shared/HOCs'
import {withSpinner} from './shared/Spinner'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

import AccountLink from './shared/AccountLink'
import Logo from './shared/Logo'
import Asset from './shared/Asset'
import OperationList from './OperationList'
import TransactionTable from './TransactionTableContainer'

const stellarAddressFromURI = () => {
  if (!window || !window.location || !window.location.pathname) return
  const path = window.location.pathname
  const lastPath = path.substring(path.lastIndexOf('/') + 1)
  return isStellarAddress(lastPath) ? lastPath : undefined
}

const NameValueTable = ({data, decodeValue = false}) => {
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
                : decodeValue ? base64Decode(data[key]) : data[key]}
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
            {signer.type === 'ed25519_public_key' && (
              <AccountLink account={signer.key} />
            )}
            {signer.type === 'sha256_hash' &&
              StrKey.decodeSha256Hash(signer.key).toString('hex')}
            {signer.type === 'preauth_tx' &&
              StrKey.decodePreAuthTx(signer.key).toString('hex')}
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
const Data = ({data}) => <NameValueTable data={data} decodeValue />

const AccountSummaryPanel = ({
  account: a,
  accountUrl,
  formatMessageFn,
  knownAccounts,
}) => {
  const header = titleWithJSONButton(
    formatMessageFn({id: 'account'}),
    accountUrl
  )
  const stellarAddr = stellarAddressFromURI()
  return (
    <Panel header={header}>
      {has(knownAccounts, a.id) &&
        <div style={{marginBottom: 10}}>
          <Logo img={knownAccounts[a.id].img} name={knownAccounts[a.id].name} />
        </div>}
      <Grid style={{paddingLeft: 0}}>
        <Row>
          <Col md={3}>
            <FormattedMessage id="key.public" />:
          </Col>
          <Col md={9}>
            {a.id}
          </Col>
        </Row>
        {stellarAddr &&
          <Row>
            <Col md={3}>
              <FormattedMessage id="stellar.address" />:
            </Col>
            <Col md={9}>
              {stellarAddr}
            </Col>
          </Row>}
        <Row>
          <Col md={3}>
            <FormattedMessage id="home.domain" />:
          </Col>
          <Col md={9}>
            <a href={`http://${a.home_domain}`}>
              {a.home_domain}
            </a>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <FormattedMessage id="inflation" />:
          </Col>
          <Col md={9}>
            {a.inflation_destination &&
              <AccountLink account={a.inflation_destination} />}
          </Col>
        </Row>
      </Grid>
    </Panel>
  )
}

class Account extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    const a = this.props.account
    return (
      <Grid>
        <Row>
          <AccountSummaryPanel
            account={a}
            accountUrl={this.props.urlFn(a.id)}
            formatMessageFn={formatMessage}
            knownAccounts={knownAccounts}
          />
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
    FederationServer.createForDomain(domain)
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
