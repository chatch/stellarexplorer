import React from 'react'
import FormControl from 'react-bootstrap/lib/FormControl'
import {withRouter} from 'react-router'
import {injectIntl} from 'react-intl'
import {isPublicKey, isStellarAddress, isTxHash} from '../../lib/utils'

class SearchBox extends React.Component {
  state = {
    fromBox: true,
  }

  noMatch = searchStr => {
    console.log(`unknown search string [${searchStr}]`)
    window.location.href = `/error/not-found/${searchStr}`
  }

  search = searchStr => {
    console.log(`searchStr: ${searchStr}`)
    if (isPublicKey(searchStr)) {
      this.props.history.push(`/account/${searchStr}`)
    } else if (isTxHash(searchStr)) {
      this.props.history.push(`/tx/${searchStr}`)
    } else if (Number.isInteger(Number(searchStr))) {
      this.props.history.push(`/ledger/${searchStr}`)
    } else if (isStellarAddress(searchStr)) {
      this.props.history.push(`/account/${searchStr}`)
    } else {
      this.noMatch(searchStr)
    }
  }

  searchHandler = event => {
    event.preventDefault()
    const searchBox = event.target.firstElementChild
    const searchStr = searchBox.value.trim()
    this.search(searchStr)
  }

  componentDidMount() {
    const id = this.props.match.params.id
    if (id && id.length > 0) {
      this.search(id)
    }
  }

  render() {
    if (this.state.fromBox === false) return null // URI search
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
