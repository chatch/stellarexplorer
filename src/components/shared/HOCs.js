import React from 'react'

const withEither = (conditionalRenderingFn, EitherComponent) => (Component) => (props) => {
  return conditionalRenderingFn(props)
    ? <EitherComponent { ...props }/>
    : <Component { ...props }/>
}

export {withEither}
