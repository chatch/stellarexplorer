import React from 'react'
import {getContext} from 'recompose'
import PropTypes from 'prop-types'

const withEither = (
  conditionalRenderingFn,
  EitherComponent
) => Component => props =>
  conditionalRenderingFn(props)
    ? <EitherComponent {...props} />
    : <Component {...props} />

// @see App.js which puts this stellar server handle on the context
const withServer = getContext({server: PropTypes.object})

export {withEither, withServer}
