import {compose} from 'recompose'
import {withPaging} from './shared/Paging'
import {withDataFetchingContainer} from './shared/DataFetchingContainer'
import LedgerTable from './LedgerTable'

const rspRecToPropsRec = rspRec => {
  return {
    sequence: rspRec.sequence,
    time: rspRec.closed_at,
    txCountSuccessful: rspRec.successful_transaction_count,
    txCountFailed: rspRec.failed_transaction_count,
  }
}

const fetchRecords = props => {
  const builder = props.server.ledgers()
  builder.limit(props.limit)
  builder.order('desc')
  return builder.call()
}

const callBuilder = props => props.server.ledgers()

const enhance = compose(
  withPaging(),
  withDataFetchingContainer(fetchRecords, rspRecToPropsRec, callBuilder)
)
export default enhance(LedgerTable)
