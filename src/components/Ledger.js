import React from 'react'
import { Grid, Row } from 'react-bootstrap'
import { server as stellar } from '../lib/Stellar'
import TransactionTable from './TransactionTable'

class Ledger extends React.Component {
    constructor(props) {
        super(props)
        this.state = {seq: this.props.match.params.id}
    }

    componentDidMount() {
        stellar.ledgers().ledger(this.state.seq).call().then((res) => {
            this.setState({
                time: res.closed_at,
                txCount: res.transaction_count,
                opCount: res.operation_count,
                hash: res.hash,
                prevHash: res.prev_hash,
                protocol: res.protocol_version
            })
        })
    }

    render() {
        const s = this.state
        return (
            <Grid>
                <Row>
                    <div>Ledger Number {s.seq}</div>
                    <div>Time {s.time}</div>
                    <div>Ops {s.opCount}</div>
                    <div>Hash {s.hash}</div>
                    <div>Prev Hash {s.prevHash}</div>
                    <div>Protocol Version {s.protocol}</div>
                    <div>Txs {s.txCount}</div>
                    <TransactionTable ledger={s.seq}/>
                </Row>
            </Grid>
        )
    }
}

export default Ledger
