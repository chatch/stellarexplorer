import React from 'react'
import PropTypes from 'prop-types'

const linkStyle = {color: 'white', textDecoration: 'underline'}

const TitleWithLink = ({title, rightLinkLabel, rightLinkAddr}) =>
  <div>
    <span>{title}</span>
    <a href={rightLinkAddr} className="pull-right" style={linkStyle}>
      {rightLinkLabel}
    </a>
  </div>

TitleWithLink.propTypes = {
  title: PropTypes.string.isRequired,
  rightLinkLabel: PropTypes.string.isRequired,
  rightLinkAddr: PropTypes.string.isRequired,
}

export default TitleWithLink
