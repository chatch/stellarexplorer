import React from 'react'
import {Table} from 'react-bootstrap'

class CreateAccount extends React.Component {
    render() {
        const d = this.props.data
        return (
            <Table>
                <tbody>
                    <tr>
                        <td>Account</td>
                        <td>{d.account}</td>
                    </tr>
                    <tr>
                        <td>Funder</td>
                        <td>{d.funder}</td>
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
