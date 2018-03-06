import React from 'react'
import PagingControls from './PagingControls'

const usePagingCondition = props => props.usePaging === true

const withPaging = () => Component => {
  return class extends React.Component {
    state = {
      hide: false,
      page: 0,
    }

    handleClickNext = e =>
      this.setState({
        page: this.state.page + 1,
      })

    handleClickPrev = e =>
      this.setState({
        page: this.state.page >= 1 ? this.state.page - 1 : 0,
      })

    // let children dynamically hide the paging controls
    // eg. if a result set is 0 or small
    handleHide = () => {
      this.setState({hide: true})
    }

    render() {
      if (usePagingCondition(this.props) === false)
        return <Component {...this.props} />
      return (
        <div>
          {!this.state.hide && (
            <PagingControls
              hidePrev={this.state.page === 0}
              handleClickNext={this.handleClickNext}
              handleClickPrev={this.handleClickPrev}
            />
          )}
          <Component
            {...this.props}
            page={this.state.page}
            hidePagingFn={this.handleHide}
          />
        </div>
      )
    }
  }
}

export {withPaging}
