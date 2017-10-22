import React from 'react'
import PropTypes from 'prop-types'

// 2 supported logo forms
const squareDimensions = {height: 75, width: 75}
const rectangleDimensions = {height: 40, width: 150}

const Logo = ({name, src}) => {
  const imgSrc = src
    ? src
    : `${process.env.PUBLIC_URL}/img/${name.toLowerCase()}.png`
  const isDirectoryLogo = imgSrc.startsWith('data:image')
  const dimen = isDirectoryLogo ? squareDimensions : rectangleDimensions
  return (
    <span>
      <img
        src={imgSrc}
        alt={name}
        title={name}
        height={dimen.height}
        width={dimen.width}
      />
    </span>
  )
}

Logo.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string,
}

export default Logo
