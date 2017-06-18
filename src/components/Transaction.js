import React from 'react'
import {Grid, Row, Table, Panel, Accordion} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {FormattedDate, FormattedTime, FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'
import {withServer} from './shared/HOCs'
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
  static defaultProps = {
    operations: []
  }

  render() {
    const {
      id,
      fee,
      ledger,
      memoType,
      operations,
      time
    } = this.props

    if (!id)
      return null

    return (
      <Grid>
        <Row>
          <Panel header="Transaction Details">
            <Table className="table-hover table-condensed" fill>
              <tbody>
                <tr>
                  <td><FormattedMessage id="hash"/></td>
                  <td>{id}</td>
                </tr>
                <tr>
                  <td><FormattedMessage id="time"/></td>
                  <td><FormattedDate value={time}/>&nbsp;
                    <FormattedTime value={time}/>
                  </td>
                </tr>
                <tr>
                  <td>Fee</td>
                  <td>{fee}&nbsp; stroops</td>
                </tr>
                <tr>
                  <td><FormattedMessage id="ledger"/></td>
                  <td>
                    <Link to={`/ledger/${ledger}`}>{ledger}</Link>
                  </td>
                </tr>
                <tr>
                  <td>Memo Type</td>
                  <td>{memoType}</td>
                </tr>
              </tbody>
            </Table>
          </Panel>
        </Row>
        <Row>
          <h3>{`Operations (${operations.length})`}</h3>
          <OperationsList operations={operations}/>
        </Row>
      </Grid>
    )
  }
}

Transaction.propTypes = {
  fee: PropTypes.number,
  id: PropTypes.string,
  ledger: PropTypes.number,
  memoType: PropTypes.string,
  operations: PropTypes.array,
  time: PropTypes.string
}

class TransactionContainer extends React.Component {
  state = {
    operations: []
  }

  componentDidMount() {
    const id = this.props.match.params.id
    const server = this.props.server
    server.transactions().transaction(id).call().then((res) => {
      this.setState({tx: res})
      return server.operations().forTransaction(id).limit(50).call()
    }).then((ops) => {
      this.setState({operations: ops.records})
    }).catch((err) => {
      console.error(`Failed to fetch records: [${err.stack}]`)
    })
  }

  render() {
    if (!this.state.tx)
      return null
    const tx = this.state.tx
    return (<Transaction
      id={tx.id}
      fee={tx.fee_paid}
      ledger={tx.ledger_attr}
      memoType={tx.memo_type}
      time={tx.created_at}
      operations={this.state.operations}/>)
  }
}

export default withServer(TransactionContainer)
