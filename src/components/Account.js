import React from 'react'
import {Col, Grid, Panel, Row, Table} from 'react-bootstrap'
import {injectIntl, FormattedMessage} from 'react-intl'

import anchors from '../lib/Anchors'
import AccountLink from './shared/AccountLink'
import Asset from './shared/Asset'
import {withServer} from './shared/HOCs'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'
import TransactionTable from './TransactionTableContainer'
import OperationList from './OperationList'

const balanceRow = bal =>
  <tr key={bal.asset_code ? bal.asset_code : 'XLM'}>
    <td>
      <Asset
        type={bal.asset_type}
        code={bal.asset_code}
        issuer={bal.asset_issuer}
      />
    </td>
    <td>{bal.balance}</td>
    <td>{bal.limit}</td>
  </tr>

const Balances = props =>
  <Table>
    <thead>
      <tr>
        <th><FormattedMessage id="asset" /></th>
        <th><FormattedMessage id="balance" /></th>
        <th><FormattedMessage id="limit" /></th>
      </tr>
    </thead>
    <tbody>
      {props.balances.map(balanceRow)}
    </tbody>
  </Table>

const Thresholds = props =>
  <div>
    <h4><FormattedMessage id="thresholds" /></h4>
    <Table>
      <thead>
        <tr>
          <th><FormattedMessage id="low" /></th>
          <th><FormattedMessage id="medium" /></th>
          <th><FormattedMessage id="high" /></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{props.thresholds.low_threshold}</td>
          <td>{props.thresholds.med_threshold}</td>
          <td>{props.thresholds.high_threshold}</td>
        </tr>
      </tbody>
    </Table>
  </div>

const Signers = props =>
  <div>
    <h4><FormattedMessage id="signers" /></h4>
    <Table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Weight</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {props.signers.map(signer =>
          <tr key={signer.public_key}>
            <td><AccountLink account={signer.public_key} /></td>
            <td>{signer.weight}</td>
            <td>{signer.type}</td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>

const Flags = props =>
  <div>
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(props.flags).map(flag =>
          <tr key={flag}>
            <td>{flag}</td>
            <td>
              {typeof props.flags[flag] === 'boolean'
                ? props.flags[flag].toString()
                : props.flags[flag]}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>

const Issuer = props =>
  <div>
    {props.issuer.img
      ? <img
          src={`${process.env.PUBLIC_URL}/img/${props.issuer.img}`}
          alt={props.issuer.name}
        />
      : props.issuer.name}
  </div>

class Account extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    const a = this.props.account
    const header = titleWithJSONButton(
      a.id,
      formatMessage({id: 'account'}),
      this.props.urlFn
    )

    return (
      <Grid>
        <Row>
          <Panel header={header}>
            {anchors.hasOwnProperty(a.id) &&
              <Issuer id={a.id} issuer={anchors[a.id]} />}

            <h4>Public Key</h4>
            {'   '}{a.id}
          </Panel>
        </Row>
        <Row>
          <Panel header="Balances">
            <Balances balances={a.balances} />
          </Panel>
        </Row>
        <Row>
          <Panel header="Signing">
            <Col md={9}>
              <Signers signers={a.signers} />
            </Col>
            <Col md={3}>
              <Thresholds thresholds={a.thresholds} />
            </Col>
          </Panel>
        </Row>
        <Row>
          <Panel header="Flags">
            <Flags flags={a.flags} />
          </Panel>
        </Row>
        <Row>
          <Panel header={formatMessage({id: 'operations'})}>
            <OperationList
              key={a.id}
              account={a.id}
              compact={false}
              limit={20}
              usePaging
            />
          </Panel>
        </Row>
        <Row>
          <Panel header={formatMessage({id: 'transactions'})}>
            <TransactionTable
              key={a.id}
              account={a.id}
              compact={false}
              limit={10}
              usePaging
            />
          </Panel>
        </Row>
      </Grid>
    )
  }
}

class AccountContainer extends React.Component {
  state = {
    account: null,
  }

  componentDidMount() {
    this.loadAccount(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    this.loadAccount(nextProps.match.params.id)
  }

  loadAccount(accountId) {
    this.props.server.accounts().accountId(accountId).call().then(res => {
      this.setState({account: res})
    })
  }

  render() {
    if (this.state.account == null) return null
    return (
      <Account
        account={this.state.account}
        urlFn={this.props.server.accountURL}
        {...this.props}
      />
    )
  }
}

export default injectIntl(withServer(AccountContainer))
