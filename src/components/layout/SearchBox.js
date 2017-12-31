import React from 'react'
import FormControl from 'react-bootstrap/lib/FormControl'
import InputGroup from 'react-bootstrap/lib/InputGroup'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import {withRouter} from 'react-router'
import {injectIntl} from 'react-intl'
import {searchStrToPath} from '../../lib/search'

class SearchBox extends React.Component {
  state = {
    searchStr: '',
  }

  searchHandler = event => {
    event.preventDefault()
    const matchPath = searchStrToPath(this.state.searchStr)
    this.props.history.push(matchPath)
  }

  render() {
    const {formatMessage} = this.props.intl
    return (
      <form onSubmit={this.searchHandler}>
        <InputGroup>
          <FormControl
            type="text"
            className="Search-box"
            onChange={e => this.setState({searchStr: e.target.value})}
            placeholder={formatMessage({id: 'search.placeHolder'})}
          />
          <InputGroup.Addon>
            <Glyphicon
              glyph="search"
              style={{paddingTop: 3}}
              onClick={this.searchHandler}
            />
          </InputGroup.Addon>
        </InputGroup>
      </form>
    )
  }
}

export default injectIntl(withRouter(SearchBox))
