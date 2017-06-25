import React from 'react'
import {getContext} from 'recompose'

const withEither = (
  conditionalRenderingFn,
  EitherComponent
) => Component => props =>
  conditionalRenderingFn(props)
    ? <EitherComponent {...props} />
    : <Component {...props} />

// @see App.js which puts this stellar server handle on the context
const withServer = getContext({server: React.PropTypes.object})

export {withEither, withServer}
