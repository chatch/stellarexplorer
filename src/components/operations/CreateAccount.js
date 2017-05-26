import React from 'react'
import {Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'

class CreateAccount extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Table>
                <tbody>
                    <tr>
                        <td>Account</td>
                        <td><Link to={`/account/${d.account}`}>{d.account}</Link></td>
                    </tr>
                    <tr>
                        <td>Funder</td>
                        <td><Link to={`/account/${d.funder}`}>{d.funder}</Link></td>
                    </tr>
                    <tr>
                        <td>Starting Balance</td>
                        <td>{d.starting_balance}</td>
                    </tr>
                </tbody>
            </Table>
        )
    }
}

export default CreateAccount
