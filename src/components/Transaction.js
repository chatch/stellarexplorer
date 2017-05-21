import React from 'react'
import { Grid, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { server as stellar } from '../lib/Stellar'
import Operation from './operations/Operation'

const OperationsList = (props) => {
    const ops = props.operations.map((op) =>
        <Operation key={op.id} data={op}/>
    )
    return (
        <div>
            <h4>Operations ({props.operations.length})</h4>
            {ops}
        </div>
    )
}

class Transaction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {id: this.props.match.params.id}
    }

    componentDidMount() {
        let data = {}
        stellar.transactions().transaction(this.state.id).call().then((res) => {
            data.txData = res
            return res.operations()
        }).then((ops) => {
            data.ops = ops._embedded.records
        }).then(() => {
            this.setState(data)
        })
    }

    render() {
        if (!this.state.txData)
            return null
        const data = this.state.txData
        const ops = this.state.ops
        return (
            <Grid>
                <Row>
                    <div>Transaction Number {data.id}</div>
                    <div>Time {data.created_at}</div>
                    <div>Value {data.value}</div>
                    <div>Memo Type {data.memo_type}</div>
                    <div>Ledger <Link to={`/ledger/${data.ledger_attr}`}>{data.ledger_attr}</Link></div>
                </Row>
                <Row>
                    <OperationsList operations={ops} />
                </Row>
            </Grid>
        )
    }
}

export default Transaction
