import React from 'react'
import PagingControls from './PagingControls'

const usePagingCondition = (props) => props.usePaging === true

const withPaging = () => (Component) => {
  return class extends React.Component {
    state = {
      page: 0
    }

    handleClickNext = (e) => this.setState({
      page: this.state.page + 1
    })

    handleClickPrev = (e) => this.setState({
      page: (this.state.page >= 1)
        ? this.state.page - 1
        : 0
    })

    render() {
      if (usePagingCondition(this.props) === false)
        return (<Component {...this.props}/>)
      return (
        <div>
          <PagingControls
            hidePrev={this.state.page === 0}
            handleClickNext={this.handleClickNext}
            handleClickPrev={this.handleClickPrev}/>
          <Component {...this.props} page={this.state.page}/>
        </div>
      )
    }
  }
}

export {withPaging}
