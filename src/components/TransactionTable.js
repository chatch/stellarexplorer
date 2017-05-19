import React from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { server as stellar } from '../lib/Stellar'

class TransactionRow extends React.Component {
    // ledgerClick(e) {
    //   e.preventDefault();
    //   console.log(`ledger ${e.target.text}`);
    // }
    //
    // txClick(e) {
    //   e.preventDefault();
    //   console.log(`tx ${e.target.title}`);
    // }

    render() {
        const shortHash = this.props.key.substring(0, 10) + "..."
        return (
            <tr>
                <td>
                    <span title={this.props.key}>
                        <Link to="/tx/{this.props.key}">{shortHash}</Link>
                    </span>
                </td>
                <td>{this.props.time}</td>
                <td>{this.props.value}</td>
                <td>
                    <Link to="/ledger/{this.props.ledger}">{this.props.ledger}</Link>
                </td>
            </tr>
        )
    }
}

class TransactionTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {rows: []}
        this.updateTransactions()
    }

    render() {
        return (
            <Table id="transaction-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Time</th>
                        <th>Value</th>
                        <th>Ledger</th>
                    </tr>
                </thead>
                <tbody>{this.state.rows}</tbody>
            </Table>
        )
    }

    componentDidMount() {
        console.log(`componentDidMount()`)
        this.timerID = setInterval(() => this.updateTransactions(), 15000);
    }

    componentWillUnmount() {
        console.log(`componentWillUnmount()`)
        clearInterval(this.timerID);
    }

    updateTransactions() {
        stellar.transactions().order('desc').limit(5).call().then((result) => {
            // console.log(`ONE = [${JSON.stringify(result.records[0])}]`)
            let rows = []
            result.records.forEach((transaction) => {
                rows.push(
                    <TransactionRow
                        key={transaction.hash}
                        time={transaction.created_at}
                        value={transaction.value}
                        ledger={transaction.ledger_attr}/>
                )
            })
            // console.log(`rows = [${JSON.stringify(rows)}]`)
            this.setState({rows: rows})
        }).catch((err) => {
            console.error(`Failed to fetch transactions: [{err}]`)
        })
    }

}

export default TransactionTable
