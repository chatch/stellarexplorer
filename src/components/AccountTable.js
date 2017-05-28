import React from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedTime, FormattedDate, FormattedMessage } from 'react-intl'

import { server as stellar } from '../lib/Stellar'
import { isDefInt } from '../lib/Utils'

class AccountRow extends React.Component {
    render() {
        const txHash = this.props.hash
        const shortHash = txHash.substring(0, 10) + "..."
        return (
            <tr>
                <td>
                    <span title={txHash}>
                        <Link to={`/tx/${txHash}`}>{shortHash}</Link>
                    </span>
                </td>
                <td><FormattedDate value={this.props.time}/> <FormattedTime value={this.props.time}/></td>
                <td>{this.props.value}</td>
                <td>
                    <Link to={`/ledger/${this.props.ledger}`}>{this.props.ledger}</Link>
                </td>
            </tr>
        )
    }
}

class AccountTable extends React.Component {
    static DEFAULT_LIMIT = 5

    constructor(props) {
        super(props)
        this.state = {rows: []}
        this.update()
    }

    render() {
        return (
            <Table id="Account-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th><FormattedMessage id="time"/></th>
                        <th>Value</th>
                        <th><FormattedMessage id="ledger"/></th>
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
        const builder = stellar.Accounts()
        if (isDefInt(this.props, 'ledger'))
            builder.forLedger(this.props.ledger)
        else {
            const limit = (isDefInt(this.props, 'limit'))
                ? this.props.limit : this.DEFAULT_LIMIT
            builder.limit(limit)
            builder.order('desc')
        }

        builder.call().then((result) => {
            let rows = []
            result.records.forEach((Account) => {
                rows.push(
                    <AccountRow
                        key={Account.hash}
                        hash={Account.hash}
                        time={Account.created_at}
                        value={Account.value}
                        ledger={Account.ledger_attr}/>
                )
            })
            this.setState({rows: rows})
        }).catch((err) => {
            console.error(`Failed to fetch Accounts: [${err}]`)
        })
    }
}

export default AccountTable
