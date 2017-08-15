import React from 'react'
import PropTypes from 'prop-types'

const BadgeButton = ({label, url}) =>
  <a href={url} type="application/hal+json">
    <span
      style={{
        fontSize: '0.8em',
        backgroundColor: 'white',
        borderRadius: '3px',
        color: 'black',
        padding: 3,
      }}
    >
      {label}
    </span>
  </a>

BadgeButton.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

export default BadgeButton
