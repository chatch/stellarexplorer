import React from 'react'
import PropTypes from 'prop-types'
import CopyToClipboard from 'react-copy-to-clipboard'

import Button from 'react-bootstrap/lib/Button'
import FormControl from 'react-bootstrap/lib/FormControl'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import Modal from 'react-bootstrap/lib/Modal'

import FetchPonyfill from 'fetch-ponyfill'
const fetch = FetchPonyfill().fetch

/**
 * Button that reveals a backend resouce at 'url' when clicked.
 *
 * Used to show the underlying JSON that a view was rendered with OR for
 * showing a related resource, eg. an anchor's server.toml file.
 */
const BackendResourceBadgeButton = ({handleClickFn, label, url}) => (
  <a
    href={url}
    onClick={handleClickFn}
    style={{
      borderRadius: '60px',
      color: 'white',
      padding: '4px 12px 4px',
      backgroundColor: '#01c0c8',
      fontSize: '14px',
      fontWeight: '400',
      transition: 'all .18s ease-in-out',
    }}
  >
    {label}
  </a>
)

BackendResourceBadgeButton.propTypes = {
  handleClickFn: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

class ClipboardCopyButton extends React.Component {
  state = {copied: false}

  constructor(props, context) {
    super(props, context)
    this.handleClickCopy = this.handleClickCopy.bind(this)
  }

  handleClickCopy() {
    this.setState({copied: true})
  }

  render() {
    return (
      <CopyToClipboard text={this.props.text} onCopy={this.handleClickCopy}>
        <span>
          <Button bsStyle="primary">Copy</Button>
          {this.state.copied && <span style={{marginLeft: 5}}>Copied!</span>}
        </span>
      </CopyToClipboard>
    )
  }
}

ClipboardCopyButton.propTypes = {
  text: PropTypes.string.isRequired,
}

const ResourceModal = ({handleCloseFn, resourceStr, resourceUrl, show}) => (
  <Modal show={show} onHide={handleCloseFn}>
    <Modal.Body>
      <div>
        <ClipboardCopyButton text={resourceStr} />
        <Button
          style={{float: 'right'}}
          onClick={handleCloseFn}
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </Button>
      </div>
      <div>
        <span>{resourceUrl} &#xe205;</span>
        <br />
        <Glyphicon
          glyph="copy"
          style={{paddingTop: 3}}
          onClick={this.searchHandler}
        />
      </div>
      <FormControl
        componentClass="textarea"
        cols="58"
        rows="20"
        defaultValue={resourceStr}
        style={{marginTop: '1em'}}
      />
    </Modal.Body>
  </Modal>
)

ResourceModal.propTypes = {
  handleCloseFn: PropTypes.func.isRequired,
  resourceStr: PropTypes.string.isRequired,
  resourceUrl: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
}

class ResourceModalContainer extends React.Component {
  state = {resourceStr: '', show: false}

  componentDidMount() {
    fetch(this.props.url)
      .then(rsp => rsp.text())
      .then(rspStr =>
        this.setState({
          resourceStr: rspStr,
          show: true,
        })
      )
      .catch(err =>
        console.error(
          `Failed to fetch resource [${this.props.url}] Err: [${err}]`
        )
      )
  }

  render() {
    return (
      <ResourceModal
        handleCloseFn={this.props.handleCloseFn}
        resourceUrl={this.props.url}
        resourceStr={this.state.resourceStr}
        show={this.props.show}
      />
    )
  }
}

ResourceModalContainer.propTypes = {
  handleCloseFn: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
}

class BackendResourceBadgeButtonWithResourceModal extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.handleBackendResourceBadgeButtonClick = this.handleBackendResourceBadgeButtonClick.bind(
      this
    )
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      show: false,
    }
  }

  handleClose() {
    this.setState({show: false})
  }

  handleBackendResourceBadgeButtonClick(event) {
    event.preventDefault()
    this.setState({show: true})
  }

  render() {
    return (
      <span>
        <BackendResourceBadgeButton
          label={this.props.label}
          handleClickFn={this.handleBackendResourceBadgeButtonClick}
          url={this.props.url}
        />
        <ResourceModalContainer
          handleCloseFn={this.handleClose}
          show={this.state.show}
          url={this.props.url}
        />
      </span>
    )
  }
}

BackendResourceBadgeButtonWithResourceModal.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

export default BackendResourceBadgeButtonWithResourceModal
