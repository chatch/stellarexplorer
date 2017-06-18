import React from 'react'
import {getContext} from 'recompose'

const withEither = (conditionalRenderingFn, EitherComponent) => (Component) => (props) => {
  return conditionalRenderingFn(props)
    ? <EitherComponent { ...props }/>
    : <Component { ...props }/>
}

const withServer = getContext({server: React.PropTypes.object})

export {withEither, withServer}
