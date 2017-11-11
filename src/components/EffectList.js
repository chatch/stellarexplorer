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

const rspRecsToProps = records =>
  records.map(r => mapKeys(r, (v, k) => camelCase(k)))

const fetchRecords = props =>
  props.server.loadEffects({account: props.account, limit: props.limit})

const enhance = compose(
  withPaging(),
  withDataFetchingContainer(fetchRecords, rspRecsToProps),
  withSpinner()
)

export default enhance(EffectList)
