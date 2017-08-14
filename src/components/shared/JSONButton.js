import React from 'react'
import PropTypes from 'prop-types'

const JSONButton = props =>
  <a href={props.url} type="application/hal+json">
    <span
      style={{
        fontSize: '0.8em',
        backgroundColor: 'white',
        borderRadius: '3px',
        color: 'black',
        padding: 3,
        marginLeft: 10,
      }}
    >
      JSON
    </span>
  </a>

JSONButton.propTypes = {
  url: PropTypes.string.isRequired,
}

export default JSONButton
