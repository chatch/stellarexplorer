import React from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'

const linkStyle = {color: 'white', textDecoration: 'underline'}

class TitleWithLink extends React.Component {
  render() {
    const {title, rightLinkLabel, rightLinkAddr} = this.props
    return (
      <div>
        <span>
          {title}
        </span>
        <Link to={rightLinkAddr} className="pull-right" style={linkStyle}>
          <span>
            {rightLinkLabel}
          </span>
        </Link>
      </div>
    )
  }
}

TitleWithLink.propTypes = {
  title: PropTypes.string.isRequired,
  rightLinkLabel: PropTypes.string.isRequired,
  rightLinkAddr: PropTypes.string.isRequired,
}

export default TitleWithLink
