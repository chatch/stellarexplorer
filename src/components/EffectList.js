import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'

import mapKeys from 'lodash/mapKeys'
import camelCase from 'lodash/camelCase'

import {withDataFetchingContainer} from './shared/DataFetchingContainer'
import {withPaging} from './shared/Paging'
import {withSpinner} from './shared/Spinner'
import Effect from './Effect'

const EffectList = props => (
  <div style={{marginLeft: 5, marginRight: 20}}>
    {props.records.map(effect => {
      return (
        <Effect
          key={effect.id}
          compact={props.compact}
          effect={effect}
          effectURLFn={props.server.effectURL}
        />
      )
    })}
  </div>
)

EffectList.propTypes = {
  records: PropTypes.array.isRequired,
  server: PropTypes.object.isRequired,
}

const rspRecToPropsRec = record => mapKeys(record, (v, k) => camelCase(k))

const fetchRecords = ({account, limit, op, server, tx}) => {
  const builder = server.effects()
  if (account) builder.forAccount(account)
  if (op) builder.forOperation(op)
  if (tx) builder.forTransaction(tx)
  builder.limit(limit)
  builder.order('desc')
  return builder.call()
}

const enhance = compose(
  withPaging(),
  withDataFetchingContainer(fetchRecords, rspRecToPropsRec),
  withSpinner()
)

export default enhance(EffectList)
