import React from 'react'
import Loader from 'halogen/RingLoader'
import {withEither} from './HOCs'

const Spinner = () => <div className="spinner center-block">
  <Loader color="#14b4e6" size="80" margin="4px"/>
</div>

const withSpinner = (conditionalRenderingFn) => withEither(conditionalRenderingFn, Spinner)

export {Spinner, withSpinner}
