import React from 'react'
import {Grid, Row} from 'react-bootstrap'
import {server as stellar} from '../lib/Stellar'

const Balances = (props) => {
    const bals = props.balances.map((bal) =>
        <div>
            <div>Type: {bal.asset_type !== 'native' ? bal.asset_type : 'Lumens'}</div>
            <div>Balance: {bal.balance}</div>
            <div>Asset: {bal.asset_code}</div>
            <div>Issuer: {bal.asset_issuer}</div>
            <div>Limit: {bal.limit}</div>
            <br/>
        </div>
    )
    return (
        <div>
            <h4>Balances</h4>
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
        <div>
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

class Ledger extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id
        }
    }

    componentDidMount() {
        stellar.accounts().accountId(this.state.id).call().then((res) => {
            this.setState({account: res})
        })
    }

    render() {
        const a = this.state.account
        if (!a)
            return null
        return (
            <Grid>
                <Row>
                    <div>Account id {a.id}</div>
                    <div>Sequence {a.sequence}</div>
                    <br/>
                    <Balances balances={a.balances}/>
                    <Thresholds thresholds={a.thresholds}/>
                    <Signers signers={a.signers}/>
                </Row>
            </Grid>
        )
    }
}

export default Ledger
