import React from 'react'
import PropTypes from 'prop-types'
import CopyToClipboard from 'react-copy-to-clipboard'
import JSONPretty from 'react-json-pretty'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'

import {withSpinner} from '../shared/Spinner'

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
          <Button
            style={{backgroundColor: '#08b5e5', color: 'white', border: 0}}
          >
            Copy
          </Button>
          {this.state.copied && <span style={{marginLeft: 5}}>Copied!</span>}
        </span>
      </CopyToClipboard>
    )
  }
}

ClipboardCopyButton.propTypes = {
  text: PropTypes.string.isRequired,
}

const ResourceModalBody = ({handleCloseFn, isJson, show, text, url}) => (
  <div>
    <div>
      <ClipboardCopyButton text={text} />
      <Button
        bsSize="sm"
        style={{float: 'right', backgroundColor: '#96a2b4'}}
        onClick={handleCloseFn}
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </Button>
    </div>
    <div style={{marginTop: 20, marginBottom: 20}}>
      <a href={url} target="_blank">
        {url}
      </a>
    </div>
    <div>
      {isJson ? <JSONPretty id="json-pretty" json={text} /> : <pre>{text}</pre>}
    </div>
  </div>
)

const ResourceModalBodyWithSpinner = withSpinner()(ResourceModalBody)

const ResourceModal = props => (
  <Modal show={props.show} onHide={props.handleCloseFn}>
    <Modal.Body style={{backgroundColor: '#383f4b'}}>
      <ResourceModalBodyWithSpinner {...props} />
    </Modal.Body>
  </Modal>
)

ResourceModal.propTypes = {
  handleCloseFn: PropTypes.func.isRequired,
  isJson: PropTypes.bool.isRequired,
  show: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

class ResourceModalContainer extends React.Component {
  state = {
    fetchFailed: false,
    isJson: false,
    isLoading: true,
    show: false,
    text: '',
  }

  isJsonResponse(rsp) {
    return (
      rsp.headers.has('content-type') &&
      rsp.headers.get('content-type').indexOf('json') !== -1
    )
  }

  componentDidMount() {
    fetch(this.props.url)
      .then(rsp => Promise.all([rsp.text(), this.isJsonResponse(rsp)]))
      .then(([text, isJson]) =>
        this.setState({
          text,
          isLoading: false,
          isJson,
          show: true,
        })
      )
      .catch(err => {
        console.error(
          `Failed to fetch resource [${this.props.url}] Err: [${err}]`
        )
        this.setState({
          fetchFailed: true,
          isLoading: false,
        })
      })
  }

  render() {
    if (this.state.fetchFailed) {
      return (
        <ResourceModal
          handleCloseFn={this.props.handleCloseFn}
          isJson={false}
          isLoading={false}
          show={true}
          text="Fetch resource failed ... Try the link above."
          url={this.props.url}
        />
      )
    } else {
      return (
        <ResourceModal
          handleCloseFn={this.props.handleCloseFn}
          isJson={this.state.isJson}
          isLoading={this.state.isLoading}
          show={this.props.show}
          text={this.state.text}
          url={this.props.url}
        />
      )
    }
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

    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      show: false,
    }
  }

  handleClose() {
    this.setState({show: false})
  }

  handleClick(event) {
    event.preventDefault()
    this.setState({show: true})
  }

  render() {
    return (
      <span>
        <BackendResourceBadgeButton
          label={this.props.label}
          handleClickFn={this.handleClick}
          url={this.props.url}
        />
        {this.state.show && (
          <ResourceModalContainer
            handleCloseFn={this.handleClose}
            show={this.state.show}
            url={this.props.url}
          />
        )}
      </span>
    )
  }
}

BackendResourceBadgeButtonWithResourceModal.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

export default BackendResourceBadgeButtonWithResourceModal
