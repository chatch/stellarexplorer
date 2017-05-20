import React from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { server as stellar } from '../lib/Stellar'
import { isDefInt } from '../lib/Utils'

class LedgerRow extends React.Component {
    render() {
        return (
            <tr>
                <td>
                    <Link to={`/ledger/${this.props.sequence}`}>{this.props.sequence}</Link>
                </td>
                <td>{this.props.time}</td>
                <td>{this.props.txCount}</td>
            </tr>
        )
    }
}

class LedgerTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            rows: []
        }
        this.update()
    }

    render() {
        return (
            <Table id="ledger-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Time</th>
                        <th>Transactions</th>
                    </tr>
                </thead>
                <tbody>{this.state.rows}</tbody>
            </Table>
        )
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.update(), 15000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    update() {
        const limit = (isDefInt(this.props, 'limit'))
            ? this.props.limit : this.DEFAULT_LIMIT
        stellar.ledgers().order('desc').limit(limit).call().then((result) => {
            // console.log(`LED = [${JSON.stringify(result)}]`)
            let rows = []
            result.records.forEach((ledger) => {
                rows.push(<LedgerRow key={ledger.sequence} sequence={ledger.sequence} time={ledger.closed_at} txCount={ledger.transaction_count}/>)
            })
            // console.log(`rows = [${JSON.stringify(rows)}]`)
            this.setState({rows: rows})
        }).catch((err) => {
            console.error(`Failed to fetch ledgers: [${err}]`)
        })
    }

}

export default LedgerTable
