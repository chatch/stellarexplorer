import React from 'react'
import PropTypes from 'prop-types'

const BadgeButton = ({label, url}) =>
  <a href={url} type="application/hal+json">
    <span
      style={{
          border-radius: 60px,
          color: white,
          padding: 4px 12px 4px,
          font-weight: 500,
          background-color: #01c0c8,
          font-size: 14px,
          font-weight: 400,
          transition: all .18s ease-in-out
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
