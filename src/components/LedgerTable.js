import React from 'react'
import {Table} from 'react-bootstrap'
import {server as stellar} from '../lib/Stellar'

class LedgerRow extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.sequence}</td>
                <td>{this.props.time}</td>
                <td>{this.props.txCount}</td>
            </tr>
        )
    }
}

class LedgerTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {rows: []}
        this.updateLedgers()
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
        console.log(`componentDidMount()`)
        this.timerID = setInterval(() => this.updateLedgers(), 15000);
    }

    componentWillUnmount() {
        console.log(`componentWillUnmount()`)
        clearInterval(this.timerID);
    }

    updateLedgers() {
        stellar.ledgers().order('desc').limit(5).call().then((result) => {
            // console.log(`LED = [${JSON.stringify(result)}]`)
            let rows = []
            result.records.forEach((ledger) => {
                rows.push(
                    <LedgerRow
                        key={ledger.sequence}
                        sequence={ledger.sequence}
                        time={ledger.closed_at}
                        txCount={ledger.transaction_count}/>
                )
            })
            // console.log(`rows = [${JSON.stringify(rows)}]`)
            this.setState({rows: rows})
        }).catch((err) => {
            console.error(`Failed to fetch ledgers: [{err}]`)
        })
    }

}

export default LedgerTable
