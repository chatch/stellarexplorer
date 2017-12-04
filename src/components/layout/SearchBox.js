import React from 'react'
import FormControl from 'react-bootstrap/lib/FormControl'
import {withRouter} from 'react-router'
import {injectIntl} from 'react-intl'
import {searchStrToPath} from '../../lib/search'

class SearchBox extends React.Component {
  searchHandler = event => {
    event.preventDefault()
    const searchBox = event.target.firstElementChild
    const searchStr = searchBox.value.trim()
    const matchPath = searchStrToPath(searchStr)
    this.props.history.push(matchPath)
  }

  render() {
    const {formatMessage} = this.props.intl
    return (
      <form onSubmit={this.searchHandler}>
        <FormControl
          className="Search-box"
          placeholder={formatMessage({id: 'search.placeHolder'})}
        />
      </form>
    )
  }
}

export default injectIntl(withRouter(SearchBox))
