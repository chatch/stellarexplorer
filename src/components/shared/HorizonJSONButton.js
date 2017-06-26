import React from 'react'

const HorizonJSONButton = props =>
  <a href={props.urlFn(props.id)}>
    <span
      style={{
        fontSize: '0.8em',
        backgroundColor: 'white',
        borderRadius: '3px',
        color: 'black',
        padding: 2,
        marginLeft: 10,
      }}
    >
      JSON
    </span>
  </a>

export default HorizonJSONButton
