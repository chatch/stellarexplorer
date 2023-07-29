import React from 'react'
import MDSpinner from 'react-md-spinner'
import {withEither} from './HOCs'

const Spinner = () => (
  <div className="spinner center-block">
    <MDSpinner
      size="80"
      duration={3000}
      color1="#07a2cc"
      color2="#057b9b"
      color3="#50e3c2"
    />
  </div>
)

const isLoading = props => props.isLoading === true

const withSpinner = () => withEither(isLoading, Spinner)

export {Spinner, withSpinner}
