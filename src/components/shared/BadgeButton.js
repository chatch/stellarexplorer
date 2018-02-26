import React from 'react'
import PropTypes from 'prop-types'
import {Button, Modal} from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'

import FetchPonyfill from 'fetch-ponyfill'
const fetch = FetchPonyfill().fetch

const BadgeButton = ({handleClickFn, label}) => (
  <Button
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
  </Button>
)

BadgeButton.propTypes = {
  handleClickFn: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
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

const ShowResourceModal = ({handleCloseFn, resourceStr, show}) => (
  <Modal show={show} onHide={handleCloseFn}>
    <Modal.Header closeButton>
      <Modal.Title>Contract ShowResource</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <ClipboardCopyButton text={resourceStr} />
      <textarea
        cols="58"
        rows="20"
        defaultValue={resourceStr}
        style={{marginTop: '1em'}}
      />
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={handleCloseFn}>Close</Button>
    </Modal.Footer>
  </Modal>
)

ShowResourceModal.propTypes = {
  handleCloseFn: PropTypes.func.isRequired,
  resourceStr: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
}

class ShowResourceModalContainer extends React.Component {
  state = {resourceStr: 'some long string of stuff'}

  componentDidMount() {
    fetch(this.props.url)
      .then(rsp => rsp.text())
      .then(rspStr => {
        // if json ....
        //const ppJson = JSON.stringify(json, null, 2)
        console.log(`fetched rsp: ${rspStr.substring(0, 20)}`)
        this.setState({
          resourceStr: rspStr,
          show: true,
        })
        return null
      })
      .catch(err =>
        console.error(
          `Failed to fetch resource [${this.props.url}] Err: [${err}]`
        )
      )
  }

  render() {
    return (
      <ShowResourceModal
        handleCloseFn={this.props.handleCloseFn}
        resourceStr={this.state.resourceStr}
        show={this.props.show}
      />
    )
  }
}

ShowResourceModalContainer.propTypes = {
  handleCloseFn: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
}

class BadgeButtonWithResourceModal extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.handleBadgeButtonClick = this.handleBadgeButtonClick.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      show: false,
    }
  }

  handleClose() {
    this.setState({show: false})
  }

  handleBadgeButtonClick() {
    this.setState({show: true})
  }

  render() {
    return (
      <div>
        <BadgeButton
          label={this.props.label}
          handleClickFn={this.handleBadgeButtonClick}
        />
        <ShowResourceModalContainer
          handleCloseFn={this.handleClose}
          show={this.state.show}
          url={this.props.url}
        />
      </div>
    )
  }
}

BadgeButtonWithResourceModal.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

export default BadgeButtonWithResourceModal
