import React from 'react'
import FormControl from 'react-bootstrap/lib/FormControl'
import {withRouter} from 'react-router'
import {injectIntl} from 'react-intl'
import {isPublicKey, isTxHash} from '../../lib/Utils'

class SearchBox extends React.Component {
  noMatch = searchStr => {
    console.log(`unknown search string [${searchStr}]`)
    window.location.href = `/error/not-found/${searchStr}`
  }

  search = event => {
    event.preventDefault()

    const searchBox = event.target.firstElementChild
    const searchStr = searchBox.value.trim()
    console.log(searchStr)

    if (isPublicKey(searchStr)) {
      this.props.history.push(`/account/${searchStr}`)
    } else if (isTxHash(searchStr)) {
      this.props.history.push(`/tx/${searchStr}`)
    } else if (Number.isInteger(Number(searchStr))) {
      this.props.history.push(`/ledger/${searchStr}`)
    } else {
      this.noMatch(searchStr)
    }
  }

  render() {
    const {formatMessage} = this.props.intl
    return (
      <form onSubmit={this.search}>
        <FormControl
          className="Search-box"
          placeholder={formatMessage({id: 'search.placeHolder'})}
        />
      </form>
    )
  }
}

export default injectIntl(withRouter(SearchBox))
