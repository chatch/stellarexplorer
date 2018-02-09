import React from 'react'
import PropTypes from 'prop-types'

const BadgeButton = ({label, url}) =>
  <a href={url} type="application/hal+json">
    <span
      style={{
          borderRadius: '60px',
          color: 'white',
          padding: '4px 12px 4px',
          backgroundColor: '#01c0c8',
          fontSize: '14px',
          fontWeight: '400',
          transition: 'all .18s ease-in-out'
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
