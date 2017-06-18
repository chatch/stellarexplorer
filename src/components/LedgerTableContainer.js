import {compose} from 'recompose'
import {withPaging} from './shared/Paging'
import {withDataFetchingContainer} from './shared/DataFetchingContainer'
import LedgerTable from './LedgerTable'

const rspRecsToProps = (records) => {
  return records.map((rspRec) => {
    const rec = {
      sequence: rspRec.sequence,
      time: rspRec.closed_at,
      txCount: rspRec.transaction_count
    }
    return rec
  })
}

const fetchRecords = (props) => {
  const builder = props.server.ledgers()
  builder.limit(props.limit)
  builder.order('desc')
  return builder.call()
}

const enhance = compose(withPaging(), withDataFetchingContainer(fetchRecords, rspRecsToProps))
export default enhance(LedgerTable)
