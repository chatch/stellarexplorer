import React from 'react'
import { FormControl } from 'react-bootstrap'
import { withRouter } from 'react-router'
import { isAccount } from '../../lib/Utils'

class SearchBox extends React.Component {
  constructor(props) {
    super(props)
    this.search = this.search.bind(this)
  }

  render() {
    const placeHolderText = "Search by Ledger / Account ID / Transaction Hash"
    return (
      <form onSubmit={this.search}>
        <FormControl placeholder={placeHolderText} className="Search-box"/>
      </form>
    )
  }

  search(event) {
      event.preventDefault()

      const searchBox = event.target.firstElementChild
      const searchStr = searchBox.value.trim()
      console.log(searchStr)

      if (isAccount(searchStr)) {
        console.log('account search')
        this.props.history.push(`/account/${searchStr}`)
      } else {
        console.log(`WHAT IS THIS [${searchStr}]`)
      }
  }

}

export default withRouter(SearchBox)
