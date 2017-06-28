import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

const ManageData = ({name, value}) => {
  const isRemove = value === ''
  const desc = `${isRemove ? 'Remove' : 'Set'} Key`
  return (
    <span>
      {`${desc} ${_.truncate(name)}`}
      {!isRemove && ` to ${_.truncate(value)}`}
    </span>
  )
}

ManageData.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
}

export default ManageData
