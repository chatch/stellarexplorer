import React from 'react'
import {Grid, Row, Panel} from 'react-bootstrap'
import {injectIntl, FormattedMessage} from 'react-intl'
import {server as stellar} from '../lib/Stellar'
import TransactionTable from './TransactionTable'
import Asset from './shared/Asset'

const Balances = (props) => {
    const bals = props.balances.map((bal) =>
        <div key={bal.asset_type}>
            <Asset type={bal.asset_type}
                   code={bal.asset_code}
                   issuer={bal.asset_issuer} />
            <div><FormattedMessage id="balance"/>: {bal.balance}</div>
            <div>Limit: {bal.limit}</div>
            <br/>
        </div>
    )
    return (
        <div>
            <h4><FormattedMessage id="balances"/></h4>
            {bals}
        </div>
    )
}

const Thresholds = (props) => {
    return (
        <div>
            <h4>Thresholds</h4>
            <div>Low: {props.thresholds.low_threshold}</div>
            <div>Med: {props.thresholds.med_threshold}</div>
            <div>High: {props.thresholds.high_threshold}</div>
            <br/>
        </div>
    )
}

const Signers = (props) => {
    const signers = props.signers.map((signer) =>
        <div key={signer.public_key}>
            <div>Key: {signer.public_key}</div>
            <div>Weight: {signer.weight}</div>
            <br/>
        </div>
    )
    return (
        <div>
            <h4>Signers</h4>
            {signers}
        </div>
    )
}

class Account extends React.Component {
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
        if (this.state === null || this.state.account === null)
            return null

        const a = this.state.account
        // const {formatMessage} = this.props.intl

        return (
            <Grid>
                <Row>
                    <div><FormattedMessage id="account"/> {a.id}</div>
                    <div>Sequence {a.sequence}</div>
                    <br/>
                    <Balances balances={a.balances}/>
                    <Thresholds thresholds={a.thresholds}/>
                    <Signers signers={a.signers}/>
                </Row>
                <Row>
                        <TransactionTable account={a.id} limit={10}/>
                </Row>
            </Grid>
        )
    }
}

export default Account
