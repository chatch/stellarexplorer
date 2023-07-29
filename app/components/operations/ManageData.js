import React from 'react'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'
import truncate from 'lodash/truncate'
import {base64Decode} from '../../lib/utils'

const MSG_KEY_PREFIX = 'operation.manage.data'

const ManageData = ({name, value}) => {
  const isRemove = value === ''
  return (
    <span>
      <FormattedMessage
        id={`${MSG_KEY_PREFIX}.${isRemove ? 'remove' : 'set'}`}
        values={{
          name: truncate(name),
        }}
      />
      {!isRemove &&
        <FormattedMessage
          id={`${MSG_KEY_PREFIX}.set.to`}
          values={{
            value: truncate(base64Decode(value)),
          }}
        />}
    </span>
  )
}

ManageData.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
}

export default ManageData
