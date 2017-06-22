import {compose} from 'recompose'
import {withPaging} from './shared/Paging'
import {withDataFetchingContainer} from './shared/DataFetchingContainer'
import {isDefInt, isAccount} from '../lib/Utils'
import TransactionTable from './TransactionTable'

const rspRecsToProps = records =>
  records.map(rspRec => {
    return {
      hash: rspRec.hash,
      ledger: rspRec.ledger_attr,
      opCount: rspRec.operation_count,
      time: rspRec.created_at,
    }
  })

const fetchRecords = props => {
  const builder = props.server.transactions()
  if (isDefInt(props, 'ledger')) builder.forLedger(props.ledger)
  if (isAccount(props.account)) builder.forAccount(props.account)
  builder.limit(props.limit)
  builder.order('desc')
  return builder.call()
}

const enhance = compose(
  withPaging(),
  withDataFetchingContainer(fetchRecords, rspRecsToProps)
)
export default enhance(TransactionTable)
