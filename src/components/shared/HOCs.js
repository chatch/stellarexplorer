import React from 'react'

import Spinner from './Spinner'

function withSpinner(WrappedComponent, conditionalRenderingFn) {
  return class extends React.Component {
    render() {
      return conditionalRenderingFn(this.props)
        ? <Spinner/>
        : <WrappedComponent { ...this.props }/>
    }
  }
}

export {withSpinner}
