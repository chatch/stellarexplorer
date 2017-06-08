import React from 'react'
import {Pager} from 'react-bootstrap'

import Spinner from './Spinner'

function withEither(OnTrueComponent, OnFalseComponent, conditionalRenderingFn) {
  return class extends React.Component {
    render() {
      return conditionalRenderingFn(this.props)
        ? <OnTrueComponent { ...this.props }/>
        : <OnFalseComponent { ...this.props }/>
    }
  }
}

function withSpinner(WrappedComponent, conditionalRenderingFn) {
  return withEither(Spinner, WrappedComponent, conditionalRenderingFn)
}

function withPaging(WrappedComponent, conditionalRenderingFn) {
  return class extends React.Component {
    render() {
      if (conditionalRenderingFn(this.props) === false)
        return (<WrappedComponent {...this.props}/>)
      return (
        <div>
          <Paging
            handleClickNext={this.props.handleClickNext}
            handleClickPrev={this.props.handleClickPrev}/>
          <WrappedComponent {...this.props}/>
        </div>
      )
    }
  }
}

function Paging(props) {
  return (
    <Pager>
      <Pager.Item previous onClick={props.handleClickPrev} href="#">&larr; Previous Page</Pager.Item>
      <Pager.Item next onClick={props.handleClickNext} href="#">Next Page &rarr;</Pager.Item>
    </Pager>
  )
}

export {withSpinner, withPaging}
