import React from 'react'
import {Grid, Row, Table, Panel, Accordion} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {FormattedDate, FormattedTime, FormattedMessage} from 'react-intl'
import {server as stellar} from '../lib/Stellar'
import Operation from './operations/Operation'

const OperationsList = (props) => {
  const ops = props.operations.map((op) => <Operation key={op.id} data={op}/>)
  return (
    <Accordion>
      {ops}
    </Accordion>
  )
}

class Transaction extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id
    }
  }

  componentDidMount() {
    let data = {}
    stellar.transactions().transaction(this.state.id).call().then((res) => {
      data.txData = res
      return stellar.operations().forTransaction(this.state.id).limit(50).call()
    }).then((ops) => {
      data.ops = ops.records
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
          <Panel header="Transaction Details">
            <Table className="table-hover table-condensed" fill>
              <tbody>
                <tr>
                  <td><FormattedMessage id="hash"/></td>
                  <td>{data.id}</td>
                </tr>
                <tr>
                  <td><FormattedMessage id="time"/></td>
                  <td><FormattedDate value={data.created_at}/>
                    <FormattedTime value={data.created_at}/></td>
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
                  <td><FormattedMessage id="ledger"/></td>
                  <td>
                    <Link to={`/ledger/${data.ledger_attr}`}>{data.ledger_attr}</Link>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Panel>
        </Row>
        <Row>
          <h3>{`Operations (${ops.length})`}</h3>
          <OperationsList operations={ops}/>
        </Row>
      </Grid>
    )
  }
}

export default Transaction
