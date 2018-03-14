import React from 'react'
import FormControl from 'react-bootstrap/lib/FormControl'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import InputGroup from 'react-bootstrap/lib/InputGroup'
import Modal from 'react-bootstrap/lib/Modal'
import {withRouter} from 'react-router'
import {injectIntl} from 'react-intl'
import {searchStrToPath} from '../../lib/search'

const HelpModal = props => (
  <Modal show={props.show} onHide={props.handleCloseFn}>
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-lg">Search Help</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{color: '#dce2ec'}}>
      <div>
        Search By:
        <ul>
          <li>Stellar address</li>
          <li>Asset code</li>
          <li>Anchor name</li>
          <li>Public account</li>
          <li>Transaction Hash</li>
          <li>Ledger Number</li>
        </ul>
      </div>
      <div>
        <h4>Stellar address</h4>
        Search by public address here
      </div>
      <div>
        <h4>Asset code</h4>
        If there is only one asset for the matching code the issuer account page
        is shown. If there is more then one then select the asset from the list.
      </div>
    </Modal.Body>
  </Modal>
)

class SearchBox extends React.Component {
  state = {
    searchStr: '',
    showHelp: false,
  }

  constructor(props, context) {
    super(props, context)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose() {
    this.setState({show: false})
  }

  handleClick(event) {
    event.preventDefault()
    this.setState({show: true})
  }

  searchHandler = event => {
    event.preventDefault()
    const matchPath = searchStrToPath(this.state.searchStr)
    this.props.history.push(matchPath)
  }

  render() {
    const {formatMessage} = this.props.intl
    return (
      <div id="Search-Container">
        <form onSubmit={this.searchHandler}>
          <InputGroup>
            <FormControl
              type="text"
              onChange={e => this.setState({searchStr: e.target.value})}
              placeholder={formatMessage({id: 'search.placeHolder'})}
            />
            <InputGroup.Addon>
              <Glyphicon glyph="search" onClick={this.searchHandler} />
            </InputGroup.Addon>
            <InputGroup.Addon>
              <Glyphicon
                className="info-icon"
                glyph="info-sign"
                onClick={this.handleClick}
              />
            </InputGroup.Addon>
          </InputGroup>
        </form>
        {this.state.show && (
          <HelpModal handleCloseFn={this.handleClose} show={this.state.show} />
        )}
      </div>
    )
  }
}

export default injectIntl(withRouter(SearchBox))
