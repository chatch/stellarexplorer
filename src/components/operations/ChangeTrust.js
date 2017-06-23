import React from 'react'
import Trust from './Trust'

const ChangeTrust = props =>
  <Trust {...props}>
    {` with limit ${props.limit}`}
  </Trust>

export default ChangeTrust
