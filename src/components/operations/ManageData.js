import React from 'react'
import PropTypes from 'prop-types'

const ManageData = ({name, value}) => {
  const isRemove = value === ''
  const desc = isRemove ? 'Remove key' : 'Sey key'
  return (
    <span>
      {`${desc} ${name}`}
      {!isRemove && ` to ${value}`}
    </span>
  )
}

ManageData.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
}

export default ManageData
