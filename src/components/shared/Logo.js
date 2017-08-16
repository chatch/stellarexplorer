import React from 'react'
import PropTypes from 'prop-types'

const Logo = ({img, name}) => {
  if (!img) img = `${name.toLowerCase()}.png`
  return (
    <span>
      {img && <img src={`${process.env.PUBLIC_URL}/img/${img}`} alt={name} />}
    </span>
  )
}

Logo.propTypes = {
  img: PropTypes.string,
  name: PropTypes.string.isRequired,
}

export default Logo
