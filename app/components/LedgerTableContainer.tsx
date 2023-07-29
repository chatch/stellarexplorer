



// const rspRecToPropsRec = rspRec => {
//   return {
//     sequence: rspRec.sequence,
//     time: rspRec.closed_at,
//     txCountSuccessful: rspRec.successful_transaction_count,
//     txCountFailed: rspRec.failed_transaction_count,
//   }
// }

// const fetchRecords = ({server, limit}) => {
//   const builder = server.ledgers()
//   builder.limit(limit)
//   builder.order('desc')
//   return builder.call()
// }

// const callBuilder = props => props.server.ledgers()

// const enhance = compose(
//   withPaging(),
//   withDataFetchingContainer(fetchRecords, rspRecToPropsRec, callBuilder)
// )
// export default enhance(LedgerTable)
