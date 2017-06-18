import React from 'react'
import {Grid, Panel, Row, Table} from 'react-bootstrap'
import {injectIntl, FormattedMessage} from 'react-intl'
import {withServer} from './shared/HOCs'
import anchors from '../lib/Anchors'
import TransactionTable from './TransactionTableContainer'
import Asset from './shared/Asset'

const BalanceRow = (bal) => <tr key={bal.asset_type}>
  <td><Asset type={bal.asset_type} code={bal.asset_code} issuer={bal.asset_issuer}/></td>
  <td>{bal.balance}</td>
  <td>{bal.limit}</td>
</tr>

const Balances = (props) => <div>
  <h4><FormattedMessage id="balances"/></h4>
  <Table>
    <thead>
      <tr>
        <th><FormattedMessage id="asset"/></th>
        <th><FormattedMessage id="balance"/></th>
        <th><FormattedMessage id="limit"/></th>
      </tr>
    </thead>
    <tbody>
      {props.balances.map(BalanceRow)}
    </tbody>
  </Table>
</div>

const Thresholds = (props) => <div>
  <h4><FormattedMessage id="thresholds"/></h4>
  <Table>
    <thead>
      <tr>
        <th><FormattedMessage id="low"/></th>
        <th><FormattedMessage id="medium"/></th>
        <th><FormattedMessage id="high"/></th>
      </tr>
    </thead>
    <tbody>
      <td>{props.thresholds.low_threshold}</td>
      <td>{props.thresholds.med_threshold}</td>
      <td>{props.thresholds.high_threshold}</td>
    </tbody>
  </Table>
</div>

const Signer = (signer) => <tr key={signer.public_key}>
  <td>{signer.public_key}</td>
  <td>{signer.weight}</td>
</tr>

const Signers = (props) => <div>
  <h4><FormattedMessage id="signers"/></h4>
  <Table>
    <thead>
      <tr>
        <th>Key</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      {props.signers.map(Signer)}
    </tbody>
  </Table>
</div>

const Issuer = (props) => <div>
  {props.issuer.img
    ? <img
        src={`${process.env.PUBLIC_URL}/img/${props.issuer.img}`}
        alt={props.issuer.name}/>
    : props.issuer.name}
</div>

class Account extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    const a = this.props.account
    return (
      <Grid>
        <Row>
          {anchors.hasOwnProperty(a.id) && <Issuer id={a.id} issuer={anchors[a.id]}/>}
        </Row>
        <Row>
          <div style={{
            marginTop: "10px"
          }}>{a.id}</div>
        </Row>
        <Row>
          <Balances balances={a.balances}/>
        </Row>
        <Row>
          <Signers signers={a.signers}/>
        </Row>
        <Row>
          <Thresholds thresholds={a.thresholds}/>
        </Row>
        <Row style={{
          marginTop: "20px"
        }}>
          <Panel header={formatMessage({id: "transactions"})}>
            <TransactionTable usePaging compact={false} account={a.id} limit={10}/>
          </Panel>
        </Row>
      </Grid>
    )
  }
}

class AccountContainer extends React.Component {
  state = {
    account: null
  }

  componentDidMount() {
    this.loadAccount(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    this.loadAccount(nextProps.match.params.id)
  }

  loadAccount(accountId) {
    this.props.server.accounts().accountId(accountId).call().then((res) => {
      this.setState({account: res})
    })
  }

  render() {
    return (this.state.account === null)
      ? null
      : <Account account={this.state.account} {...this.props}/>
  }
}

export default injectIntl(withServer(AccountContainer))
