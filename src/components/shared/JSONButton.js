import React from 'react'
import PropTypes from 'prop-types'

const JSONButton = props =>
  <a href={props.urlFn(props.id)} type="application/hal+json">
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
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  urlFn: PropTypes.func.isRequired,
}

export default JSONButton
