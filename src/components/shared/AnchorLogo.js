import React from 'react'
import PropTypes from 'prop-types'

const AnchorLogo = ({anchor}) =>
  <span>
    {anchor.img &&
      <img
        src={`${process.env.PUBLIC_URL}/img/${anchor.img}`}
        alt={anchor.name}
      />}
  </span>

/**
 * @see lib/Anchors.js. Prop anchor will typically one of these records.
 */
AnchorLogo.propTypes = {
  anchor: PropTypes.shape({
    img: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
}

export default AnchorLogo
