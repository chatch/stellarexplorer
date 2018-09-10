import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-bootstrap/lib/Modal'
import {FormattedMessage} from 'react-intl'

const networkAddresses = [
  'https://horizon.stellar.org',
  'https://stellar-api.wancloud.io',
  'https://api.chinastellar.com',
]

/**
 * Button that reveals modal window where the Horizon server address can
 * be configured.
 */
const CustomNetworkButton = ({handleClickFn}) =>
  <button
    className="is-inactive"
    onClick={handleClickFn}>
    <FormattedMessage id="network.set-custom" />
  </button>

CustomNetworkButton.propTypes = {
  handleClickFn: PropTypes.func.isRequired,
}

const ResourceModalBody = ({networkAddress, inputValue, dropdownValue, networkType,
                            handleSubmitFn, handleInputChangeFn, handleDropdownChangeFn}) => {
  return (
    <form onSubmit={handleSubmitFn}>
      <div>
        <h4><FormattedMessage id="network.current" /></h4>
        <FormattedMessage id={'network.' + networkType} /><br />
        <pre style={{marginTop: 5}}>{networkAddress}</pre><br />
      </div>

      <div>
        <h4><FormattedMessage id="network.change-here" /></h4>
        <FormattedMessage id="network.choose" /><br />
        <select id="networkDropdown" onChange={handleDropdownChangeFn} value={dropdownValue}>
          <option></option>
          {networkAddresses.map(address => address !== networkAddress && (
            <option>{address}</option>
            ))
          }
        </select><br/><br/>

        <FormattedMessage id="network.or-custom" /><br />
        <input
          style={{marginTop: 5}}
          type="text"
          onChange={handleInputChangeFn}
          value={inputValue}
          /><br/>

        <FormattedMessage id="save">
          {msg => (<input type="submit" value={msg} />)}
        </FormattedMessage>
      </div>
    </form>
  )
}

const ResourceModal = props => (
  <Modal id="networkModal" show={props.show} onHide={props.handleCloseFn}>
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-lg" style={{color: '#dce2ec'}}>
        <FormattedMessage id="network.address" />
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <ResourceModalBody {...props} />
    </Modal.Body>
  </Modal>
)

ResourceModal.propTypes = {
  handleCloseFn: PropTypes.func.isRequired,
  handleSubmitFn: PropTypes.func.isRequired,
  handleDropdownChangeFn: PropTypes.func.isRequired,
  dropdownValue: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
}

class ResourceModalContainer extends React.Component {
  render() {
    return (
      <ResourceModal
        handleCloseFn={this.props.handleCloseFn}
        handleSubmitFn={this.props.handleSubmitFn}
        handleDropdownChangeFn={this.props.handleDropdownChangeFn}
        handleInputChangeFn={this.props.handleInputChangeFn}
        dropdownValue={this.props.dropdownValue}
        inputValue={this.props.inputValue}
        networkAddress={this.props.networkAddress}
        networkType={this.props.networkType}
        show={this.props.show}
      />
    )
  }
}

ResourceModalContainer.propTypes = {
  handleCloseFn: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
}

class CustomNetworkButtonWithResourceModal extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDropdownChange = this.handleDropdownChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    this.state = {
      show: false,
      dropdownValue: '',
      inputValue: this.props.networkAddress,
    }
  }

  handleSubmit(event) {
    event.preventDefault()

    const input = this.state.inputValue
    const dropdown = this.state.dropdownValue
    const newNetworkAddress = dropdown !== '' ? dropdown : input
    if (newNetworkAddress !== this.props.networkAddress) {
      this.props.setNetworkAddress(newNetworkAddress)
    }
  }

  handleDropdownChange(event) {
    const newNetworkAddress = event.target.value
    this.setState({dropdownValue: newNetworkAddress})
    this.props.setNetworkAddress(newNetworkAddress)
  }

  handleInputChange(event) {
    const newNetworkAddress = event.target.value
    this.setState({inputValue: newNetworkAddress})
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
        <CustomNetworkButton
          network={this.props.network}
          networkAddress={this.networkAddress}
          handleClickFn={this.handleClick}
        />
        {this.state.show && (
          <ResourceModalContainer
            handleSubmitFn={this.handleSubmit}
            handleDropdownChangeFn={this.handleDropdownChange}
            handleInputChangeFn={this.handleInputChange}
            dropdownValue={this.state.dropdownValue}
            inputValue={this.state.inputValue}
            handleCloseFn={this.handleClose}
            setNetworkAddress={this.props.setNetworkAddress}
            networkAddress={this.props.networkAddress}
            networkType={this.props.networkType}
            show={this.state.show}
          />
        )}
      </span>
    )
  }
}

CustomNetworkButtonWithResourceModal.propTypes = {
  setNetworkAddress: PropTypes.func.isRequired,
  networkAddress: PropTypes.string.isRequired,
  networkType: PropTypes.string.isRequired,
}

export default CustomNetworkButtonWithResourceModal
