import React from 'react'
import { Grid, Row, Panel, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedDate, FormattedTime } from 'react-intl'

import { server as stellar } from '../lib/Stellar'
import Operation from './operations/Operation'

const OperationsList = (props) => {
    const ops = props.operations.map((op) =>
        <Operation key={op.id} data={op}/>
    )
    return (
        <div>
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
                <Panel header="Transation Details" bsStyle="warning">
                  <Table>
                    <tbody>
                      <tr>
                        <td>Hash</td>
                        <td>{data.id}</td>
                      </tr>
                      <tr>
                        <td>Time</td>
                        <td><FormattedDate value={data.created_at}/> <FormattedTime value={data.created_at}/></td>
                      </tr>
                      <tr>
                        <td>Value</td>
                        <td>{data.value}</td>
                      </tr>
                      <tr>
                        <td>Memo Type</td>
                        <td>{data.memo_type}</td>
                      </tr>
                      <tr>
                        <td>Ledger</td>
                        <td><Link to={`/ledger/${data.ledger_attr}`}>{data.ledger_attr}</Link></td>
                      </tr>
                    </tbody>
                  </Table>
                </Panel>
              </Row>
              <Row>
                <Panel header={`Operations (${ops.length})`} bsStyle="warning">
                  <OperationsList operations={ops} />
                </Panel>
              </Row>
            </Grid>
        )
    }
}

export default Transaction
