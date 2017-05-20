import React from 'react'
import { FormControl } from 'react-bootstrap'

class SearchBox extends React.Component {
  render() {
    const placeHolderText = "Search on Account ID / Transaction Hash / etc."
    return (
      <FormControl
        className="Search-box"
        placeholder={placeHolderText}
        onChange={this.handleChange} />
    )
  }

  handleChange(e) {
      console.log(e.target.value)
      // this.setState({ value: e.target.value });
  }
}

export default SearchBox
