import React from 'react'
import PagingControls from './PagingControls'
import Spinner from './Spinner'

const withEither = (conditionalRenderingFn, EitherComponent) => (Component) => (props) => {
  return conditionalRenderingFn(props)
    ? <EitherComponent { ...props }/>
    : <Component { ...props }/>
}

const withSpinner = (conditionalRenderingFn) => withEither(conditionalRenderingFn, Spinner)

const withPaging = (conditionalRenderingFn) => (Component) => (props) => {
  if (conditionalRenderingFn(props) === false)
    return (<Component {...props}/>)
  return (
    <div>
      <PagingControls
        handleClickNext={props.handleClickNext}
        handleClickPrev={props.handleClickPrev}/>
      <Component {...props}/>
    </div>
  )
}

export {withPaging, withSpinner}
