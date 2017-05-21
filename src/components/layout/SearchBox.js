import React from 'react'
import { FormControl } from 'react-bootstrap'
import { withRouter } from 'react-router'
import { sdk } from '../../lib/Stellar'

class SearchBox extends React.Component {
  constructor(props) {
    super(props)
    this.search = this.search.bind(this)
  }

  render() {
    const placeHolderText = "Search on Account ID / Transaction Hash / etc."
    return (
      <form onSubmit={this.search}>
        <FormControl
          className="Search-box"
          placeholder={placeHolderText} />
      </form>
    )
  }

  search(event) {
      event.preventDefault()
      const searchBox = event.target.firstElementChild
      const searchStr = searchBox.value.trim()
      console.log(searchStr)
      if (sdk.StrKey.isValidEd25519PublicKey(searchStr)) {
        console.log('account search')
        this.props.history.push(`/account/${searchStr}`)
      } else {
        console.log(`WHAT IS THIS [${searchStr}]`)
      }
  }

}

export default withRouter(SearchBox)
