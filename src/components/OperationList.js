import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'

import mapKeys from 'lodash/mapKeys'
import camelCase from 'lodash/camelCase'

import {withDataFetchingContainer} from './shared/DataFetchingContainer'
import {withPaging} from './shared/Paging'
import {withSpinner} from './shared/Spinner'
import Operation from './operations/Operation'

const OperationList = props => (
  <div style={{marginLeft: 5, marginRight: 20}}>
    {props.records.map(op => {
      return (
        <Operation
          key={op.id}
          compact={props.compact}
          op={op}
          opURLFn={props.server.opURL}
          parentRenderTimestamp={props.parentRenderTimestamp}
        />
      )
    })}
  </div>
)

OperationList.propTypes = {
  compact: PropTypes.bool,
  parentRenderTimestamp: PropTypes.number,
  records: PropTypes.array.isRequired,
  server: PropTypes.object.isRequired,
}

const rspRecToPropsRec = record => {
  record.time = record.created_at
  return mapKeys(record, (v, k) => camelCase(k))
}

const fetchRecords = props => props.server.loadOperations(props)

const callBuilder = props => props.server.operations()

const enhance = compose(
  withPaging(),
  withDataFetchingContainer(fetchRecords, rspRecToPropsRec, callBuilder),
  withSpinner()
)

export default enhance(OperationList)
