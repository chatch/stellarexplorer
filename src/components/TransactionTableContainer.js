import React from 'react'
import {compose} from 'recompose'
import {withPaging} from './shared/Paging'
import {withDataFetchingContainer} from './shared/DataFetchingContainer'
import {withDataFetchingAllContainer} from './shared/DataFetchingAllContainer'
import {isPublicKey} from '../lib/stellar/utils'
import {isDefInt} from '../lib/utils'
import TransactionTable from './TransactionTable'
import CSVExport from './shared/CSVExport'

const rspRecToPropsRec = rspRec => {
  return {
    hash: rspRec.hash,
    ledger: rspRec.ledger_attr,
    opCount: rspRec.operation_count,
    sourceAccount: rspRec.source_account,
    time: rspRec.created_at,
  }
}

const fetchRecords = props => {
  const builder = props.server.transactions()
  if (isDefInt(props, 'ledger')) builder.forLedger(props.ledger)
  if (isPublicKey(props.account)) builder.forAccount(props.account)
  builder.limit(props.limit)
  builder.order('desc')
  return builder.call()
}

const callBuilder = props => props.server.transactions()

const enhance = compose(
  withPaging(),
  withDataFetchingContainer(fetchRecords, rspRecToPropsRec, callBuilder)
)

const ExportToCSVComponent = withDataFetchingAllContainer(fetchRecords)(
  CSVExport
)

const wrapHOC = Component => props => (
  <div>
    <div>
      <Component {...props} />
    </div>
    {!props.noCSVExport && (
      <div className="text-center" id="csv-export">
        <ExportToCSVComponent {...props} />
      </div>
    )}
  </div>
)

export default enhance(wrapHOC(TransactionTable))
