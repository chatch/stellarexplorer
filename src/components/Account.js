import React from 'react'
import {Grid, Row, Panel} from 'react-bootstrap'
import {injectIntl, FormattedMessage} from 'react-intl'
import {server as stellar} from '../lib/Stellar'
import TransactionTable from './TransactionTable'
import Asset from './shared/Asset'

const Balance = (bal) =>
    <div key={bal.asset_type}>
        <Asset type={bal.asset_type}
               code={bal.asset_code}
               issuer={bal.asset_issuer} />
        <div><FormattedMessage id="balance"/>: {bal.balance}</div>
        <div><FormattedMessage id="limit"/>: {bal.limit}</div>
    </div>

const Balances = (props) =>
    <div>
        <h4><FormattedMessage id="balances"/></h4>
        {props.balances.map(Balance)}
    </div>

const Thresholds = (props) =>
    <div>
        <h4><FormattedMessage id="thresholds"/></h4>
        <div>Low: {props.thresholds.low_threshold}</div>
        <div>Med: {props.thresholds.med_threshold}</div>
        <div>High: {props.thresholds.high_threshold}</div>
    </div>

const Signer = (signer) =>
    <div key={signer.public_key}>
        <div>Key: {signer.public_key}</div>
        <div>Weight: {signer.weight}</div>
    </div>

const Signers = (props) =>
    <div>
        <h4><FormattedMessage id="signers"/></h4>
        {props.signers.map(Signer)}
    </div>

class AccountContainer extends React.Component {
  state = {
      account: null
  }

  componentDidMount() {
      this.loadAccount(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps){
      this.loadAccount(nextProps.match.params.id)
  }

  loadAccount(accountId) {
      stellar.accounts().accountId(accountId).call().then((res) => {
          this.setState({account: res})
      })
  }

  render() {
      return (this.state.account === null)
          ? null
          : <Account account={this.state.account}/>
  }
}

class Account extends React.Component {
    render() {
        const a = this.props.account
        return (
            <Grid>
                <Row>
                    <div><FormattedMessage id="account"/> {a.id}</div>
                    <div><FormattedMessage id="sequence"/> {a.sequence}</div>
                </Row>
                <Row>
                    <Balances balances={a.balances}/>
                </Row>
                <Row>
                    <Thresholds thresholds={a.thresholds}/>
                </Row>
                <Row>
                    <Signers signers={a.signers}/>
                </Row>
                <Row>
                    <TransactionTable account={a.id} limit={10}/>
                </Row>
            </Grid>
        )
    }
}

export default AccountContainer
