import React from 'react'
import Trust from './Trust'

const AllowTrust = props =>
  <Trust {...props}>
    Authorize {props.authorize}
  </Trust>

export default AllowTrust
