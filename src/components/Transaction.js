import React from 'react'
import { Grid, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { server as stellar } from '../lib/Stellar'

class Transaction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {id: this.props.match.params.id}
    }

    componentDidMount() {
        stellar.transactions().transaction(this.state.id).call().then((res) => {
            console.log(`s=[${JSON.stringify(res)}]`)

            this.setState({
                time: res.created_at,
                value: res.value,
                memoType: res.memo_type,
                ledger: res.ledger_attr
            })
        })
    }

    render() {
        const s = this.state
        console.log(`s=[${JSON.stringify(s)}]`)
        return (
            <Grid>
                <Row>
                    <div>Transaction Number {s.id}</div>
                    <div>Time {s.time}</div>
                    <div>Value {s.value}</div>
                    <div>Memo Type {s.memoType}</div>
                    <div>Ledger <Link to={`/ledger/${s.ledger}`}>{s.ledger}</Link></div>
                </Row>
            </Grid>
        )
    }
}

export default Transaction
