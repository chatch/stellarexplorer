import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import _ from 'lodash'

import {withDataFetchingContainer} from './shared/DataFetchingContainer'
import {withPaging} from './shared/Paging'
import {withSpinner} from './shared/Spinner'
import Operation from './operations/Operation'

const OperationList = props =>
  <div style={{marginLeft: 15}}>
    {props.records.map(op => {
      return <Operation key={op.id} op={op} opURLFn={props.server.opURL} />
    })}
  </div>

OperationList.propTypes = {
  records: PropTypes.array.isRequired,
}

const rspRecsToProps = records =>
  records.map(r => _.mapKeys(r, (v, k) => _.camelCase(k)))

const fetchRecords = props => {
  const builder = props.server.operations()
  if (props.tx) builder.forTransaction(props.tx)
  builder.limit(props.limit)
  builder.order('desc')
  return builder.call()
}

const enhance = compose(
  withPaging(),
  withDataFetchingContainer(fetchRecords, rspRecsToProps),
  withSpinner()
)

export default enhance(OperationList)
