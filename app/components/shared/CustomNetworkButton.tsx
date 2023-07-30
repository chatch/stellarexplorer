import React, { ChangeEventHandler, FormEvent, FormEventHandler, useState } from "react"
import Modal from "react-bootstrap/Modal"
import { FormattedMessage } from "react-intl"

const networkAddresses = [
  "https://horizon.stellar.org",
  "https://stellar-api.wancloud.io",
  "https://api.chinastellar.com",
]

/**
 * Button that reveals modal window where the Horizon server address can
 * be configured.
 */
const CustomNetworkButton = ({ handleClickFn }: {
  handleClickFn: React.MouseEventHandler<HTMLButtonElement>
}) => (
  <button className="is-inactive" onClick={handleClickFn}>
    <FormattedMessage id="network.set-custom" />
  </button>
)

interface ResourceModalBodyProps {
  networkAddress: string
  inputValue: string
  dropdownValue: string
  networkType: string
  handleSubmitFn: FormEventHandler<HTMLFormElement>
  handleInputChangeFn: ChangeEventHandler<HTMLInputElement>
  handleDropdownChangeFn: ChangeEventHandler<HTMLSelectElement>
}

const ResourceModalBody = ({
  networkAddress,
  networkType,
  inputValue,
  dropdownValue,
  handleSubmitFn,
  handleInputChangeFn,
  handleDropdownChangeFn,
}: ResourceModalBodyProps) => {
  return (
    <form onSubmit={handleSubmitFn}>
      <div>
        <h4>
          <FormattedMessage id="network.current" />
        </h4>
        <FormattedMessage id={"network." + networkType} />
        <br />
        <pre style={{ marginTop: 5 }}>{networkAddress}</pre>
        <br />
      </div>

      <div>
        <h4>
          <FormattedMessage id="network.change-here" />
        </h4>
        <FormattedMessage id="network.choose" />
        <br />
        <select
          id="networkDropdown"
          onChange={handleDropdownChangeFn}
          value={dropdownValue}
        >
          <option></option>
          {networkAddresses.map(
            (address) =>
              address !== networkAddress && <option key={address}>{address}</option>
          )}
        </select>
        <br />
        <br />

        <FormattedMessage id="network.or-custom" />
        <br />
        <input
          style={{ marginTop: 5 }}
          type="text"
          onChange={handleInputChangeFn}
          value={inputValue}
        />
        <br />

        <FormattedMessage id="save" />
        {/* {(msg) => <input type="submit" value={msg} />}
        </FormattedMessage> */}
      </div>
    </form>
  )
}

interface ResourceModalProps extends ResourceModalBodyProps {
  show: boolean
  handleCloseFn: ChangeEventHandler<HTMLInputElement>
}

const ResourceModal = (props: ResourceModalProps) => (
  <Modal id="networkModal" show={props.show} onHide={props.handleCloseFn as () => void}>
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-lg" style={{ color: "#dce2ec" }}>
        <FormattedMessage id="network.address" />
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <ResourceModalBody {...props} />
    </Modal.Body>
  </Modal>
)

interface CustomNetworkButtonWithResourceModalProps {
  setNetworkAddress: Function,
  networkAddress: string,
  networkType: string,
}

function CustomNetworkButtonWithResourceModal({ networkAddress, setNetworkAddress, networkType }: CustomNetworkButtonWithResourceModalProps) {
  const [show, setShow] = useState(false)
  const [dropdownValue, setDropdownValue] = useState('')
  const [inputValue, setInputValue] = useState(networkType)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event: FormEvent) => {
    event.preventDefault()

    const input = inputValue
    const dropdown = dropdownValue
    const newNetworkAddress = dropdown !== "" ? dropdown : input
    if (newNetworkAddress !== networkAddress) {
      setNetworkAddress(newNetworkAddress)
    }
  }

  const handleDropdownChange = (event: any) => {
    const newNetworkAddress = event.target.value
    setDropdownValue(newNetworkAddress)
    setNetworkAddress(newNetworkAddress)
  }

  const handleInputChange = (event: any) => {
    const newNetworkAddress = event.target.value
    setInputValue(newNetworkAddress)
  }

  const handleClose = () => setShow(false)

  const handleClick = (event: any) => {
    event.preventDefault()
    setShow(true)
  }

  return (
    <span>
      <CustomNetworkButton
        handleClickFn={handleClick}
      />
      {show && (
        <ResourceModal
          handleSubmitFn={handleSubmit}
          handleDropdownChangeFn={handleDropdownChange}
          handleInputChangeFn={handleInputChange}
          dropdownValue={dropdownValue}
          inputValue={inputValue}
          handleCloseFn={handleClose}
          // setNetworkAddress={setNetworkAddress}
          networkAddress={networkAddress}
          networkType={networkType}
          show={show}
        />
      )}
    </span>
  )
}

export default CustomNetworkButtonWithResourceModal
