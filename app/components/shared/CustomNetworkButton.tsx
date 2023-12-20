import type { ChangeEventHandler, FormEvent, MouseEventHandler } from 'react'
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

/**
 * Button that reveals modal window where the Horizon server address can
 * be configured.
 */
const CustomNetworkButton = ({
  handleClickFn,
}: {
  handleClickFn: React.MouseEventHandler<HTMLButtonElement>
}) => (
  <button className="is-inactive" onClick={handleClickFn}>
    <FormattedMessage id="network.set-custom" />
  </button>
)

interface ResourceModalBodyProps {
  horizonAddress: string
  sorobanRPCAddress: string
  setHorizonAddress: React.Dispatch<React.SetStateAction<string>>
  setSorobanRPCAddress: React.Dispatch<React.SetStateAction<string>>
  handleSubmitFn: MouseEventHandler<HTMLElement>
}

const ResourceModalBody = ({
  horizonAddress,
  sorobanRPCAddress,
  setSorobanRPCAddress,
  setHorizonAddress,
  handleSubmitFn,
}: ResourceModalBodyProps) => {
  return (
    <div>
      <FormattedMessage id="network.custom.horizon" />
      <input
        style={{ marginTop: 5 }}
        type="text"
        placeholder="http://localhost:8000"
        value={horizonAddress}
        onChange={(e) => setHorizonAddress(e.target.value)}
      />

      <FormattedMessage id="network.custom.soroban" />
      <input
        style={{ marginTop: 5 }}
        type="text"
        placeholder="http://localhost:8000/soroban/rpc"
        value={sorobanRPCAddress}
        onChange={(e) => setSorobanRPCAddress(e.target.value)}
      />

      <button id="btn-set-custom-network" onClick={handleSubmitFn}>
        <FormattedMessage id="save" />
      </button>
    </div>
  )
}

interface ResourceModalProps extends ResourceModalBodyProps {
  show: boolean
  handleCloseFn: ChangeEventHandler<HTMLInputElement>
}

const ResourceModal = (props: ResourceModalProps) => (
  <Modal
    id="networkModal"
    show={props.show}
    onHide={props.handleCloseFn as () => void}
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-lg" style={{ color: '#dce2ec' }}>
        <FormattedMessage id="network.set-custom" />
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <ResourceModalBody {...props} />
    </Modal.Body>
  </Modal>
)

interface CustomNetworkButtonWithResourceModalProps {
  setNetworkAddress: Function
  networkAddress: string
  networkType: string
}

function CustomNetworkButtonWithResourceModal({
  networkAddress,
  setNetworkAddress,
  networkType,
}: Readonly<CustomNetworkButtonWithResourceModalProps>) {
  const [show, setShow] = useState(false)
  const [horizonAddress, setHorizonAddress] = useState('')
  const [sorobanRPCAddress, setSorobanRPCAddress] = useState('')

  const handleSubmit: MouseEventHandler<HTMLElement> = (event: FormEvent) => {
    event.preventDefault()
    console.log(`handleSubmit: ${horizonAddress} + ${sorobanRPCAddress}`)
  }

  const handleClose = () => setShow(false)

  const handleClick = (event: any) => {
    event.preventDefault()
    setShow(true)
  }

  return (
    <span>
      <CustomNetworkButton handleClickFn={handleClick} />
      {show && (
        <ResourceModal
          handleSubmitFn={handleSubmit}
          horizonAddress={horizonAddress}
          sorobanRPCAddress={sorobanRPCAddress}
          setHorizonAddress={setHorizonAddress}
          setSorobanRPCAddress={setSorobanRPCAddress}
          handleCloseFn={handleClose}
          show={show}
        />
      )}
    </span>
  )
}

export default CustomNetworkButtonWithResourceModal
