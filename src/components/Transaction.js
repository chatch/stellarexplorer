import React from 'react'
import {Grid, Row, Table, Panel} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {FormattedDate, FormattedTime, FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'
import {withServer} from './shared/HOCs'
import OperationList from './OperationList'

class Transaction extends React.Component {
  static defaultProps = {
    operations: [],
  }

  render() {
    const {id, fee, ledger, memoType, opCount, time} = this.props

    if (!id) return null

    return (
      <Grid>
        <Row>
          <Panel header="Transaction Details">
            <Table className="table-hover table-condensed" fill>
              <tbody>
                <tr>
                  <td><FormattedMessage id="hash" /></td>
                  <td>{id}</td>
                </tr>
                <tr>
                  <td><FormattedMessage id="time" /></td>
                  <td>
                    <FormattedDate value={time} />&nbsp;
                    <FormattedTime value={time} />
                  </td>
                </tr>
                <tr>
                  <td>Fee</td>
                  <td>{fee}&nbsp; stroops</td>
                </tr>
                <tr>
                  <td><FormattedMessage id="ledger" /></td>
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
          <h3>{`Operations (${opCount})`}</h3>
          <Grid>
            <OperationList limit={opCount} tx={id} />
          </Grid>
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
  time: PropTypes.string,
}

class TransactionContainer extends React.Component {
  state = {
    operations: [],
  }

  componentDidMount() {
    const id = this.props.match.params.id
    const server = this.props.server
    server
      .transactions()
      .transaction(id)
      .call()
      .then(res => {
        this.setState({tx: res})
      })
      .catch(err => {
        console.error(`Failed to fetch record: [${err.stack}]`)
      })
  }

  render() {
    if (!this.state.tx) return null
    const tx = this.state.tx
    return (
      <Transaction
        id={tx.id}
        fee={tx.fee_paid}
        ledger={tx.ledger_attr}
        memoType={tx.memo_type}
        opCount={tx.operation_count}
        time={tx.created_at}
      />
    )
  }
}

export default withServer(TransactionContainer)
