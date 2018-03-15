import React from 'react'
import PropTypes from 'prop-types'
import CopyToClipboard from 'react-copy-to-clipboard'
import JSONPretty from 'react-json-pretty'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'

import NewWindowIcon from '../shared/NewWindowIcon'
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
    className="backend-resource-badge-button"
    href={url}
    onClick={handleClickFn}
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
    <div className="break" style={{marginBottom: 15}}>
      <a href={url} target="_blank">
        {url}
        <NewWindowIcon />
      </a>
    </div>
    <div>
      {isJson ? <JSONPretty id="json-pretty" json={text} /> : <pre>{text}</pre>}
    </div>
  </div>
)

const ResourceModalBodyWithSpinner = withSpinner()(ResourceModalBody)

const ResourceModal = props => (
  <Modal id="resourceModal" show={props.show} onHide={props.handleCloseFn}>
    <Modal.Header closeButton>
      <ClipboardCopyButton text={props.text} />
    </Modal.Header>
    <Modal.Body>
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
      this.props.url.endsWith('.json') ||
      (rsp.headers.has('content-type') &&
        rsp.headers.get('content-type').indexOf('json') !== -1)
    )
  }

  /**
   * Support filtering JSON responses.
   *
   * If filterFn property is a function then run it on the records[] in the
   * response.
   */
  filter(rspText, isJson) {
    let text = rspText
    if (isJson === true && typeof this.props.filterFn === 'function') {
      const records = JSON.parse(rspText)['_embedded'].records
      text = this.props.filterFn(records)
      // if not found then revert to the original source
      if (text == null) text = rspText
    }
    return text
  }

  componentDidMount() {
    fetch(this.props.url)
      .then(rsp => Promise.all([rsp.text(), this.isJsonResponse(rsp)]))
      .then(([text, isJson]) =>
        this.setState({
          text: this.filter(text, isJson),
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
  filterFn: PropTypes.func,
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
            filterFn={this.props.filterFn}
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
  filterFn: PropTypes.func,
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

export default BackendResourceBadgeButtonWithResourceModal
