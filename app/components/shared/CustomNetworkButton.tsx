import type { ChangeEventHandler, FormEvent, MouseEventHandler } from 'react'
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'
import { isValidUrl } from '~/lib/utils'

/**
 * Button that reveals modal window where the Horizon server address can
 * be configured.
 */
const CustomNetworkButton = ({
  handleClickFn,
  isActive,
}: {
  handleClickFn: React.MouseEventHandler<HTMLButtonElement>
  isActive: boolean
}) => (
  <button
    className={isActive ? 'is-active' : 'is-inactive'}
    onClick={handleClickFn}
  >
    <FormattedMessage id="network.set-custom" />
  </button>
)

interface ResourceModalBodyProps {
  horizonAddress: string
  sorobanRPCAddress: string
  setHorizonAddress: React.Dispatch<React.SetStateAction<string>>
  setSorobanRPCAddress: React.Dispatch<React.SetStateAction<string>>
  handleClearFn: MouseEventHandler<HTMLElement>
}

const ResourceModalBody = ({
  horizonAddress,
  sorobanRPCAddress,
  setSorobanRPCAddress,
  setHorizonAddress,
  handleClearFn,
}: ResourceModalBodyProps) => {
  return (
    <div>
      <form method="POST" action="/settings">
        <FormattedMessage id="network.custom.horizon" />
        <input
          type="text"
          name="horizonAddress"
          value={horizonAddress}
          placeholder="http://localhost:8000"
          style={{ marginTop: 5 }}
          onChange={(e) => setHorizonAddress(e.target.value)}
        />

        <FormattedMessage id="network.custom.soroban" />
        <input
          type="text"
          name="sorobanRPCAddress"
          value={sorobanRPCAddress}
          placeholder="http://localhost:8000/soroban/rpc"
          style={{ marginTop: 5 }}
          onChange={(e) => setSorobanRPCAddress(e.target.value)}
        />

        <button id="btn-custom-network-set">
          <FormattedMessage id="save" />
        </button>

        <button id="btn-custom-network-clear" onClick={handleClearFn}>
          Clear
        </button>
      </form>
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
      <Modal.Title id="contained-modal-title-lg">
        <FormattedMessage id="network.set-custom" />
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <ResourceModalBody {...props} />
    </Modal.Body>
  </Modal>
)

interface CustomNetworkButtonWithResourceModalProps {
  customHorizonAddress: string
  customSorobanRPCAddress: string
}

function CustomNetworkButtonWithResourceModal({
  customHorizonAddress,
  customSorobanRPCAddress,
}: Readonly<CustomNetworkButtonWithResourceModalProps>) {
  const [show, setShow] = useState(false)
  const [horizonAddress, setHorizonAddress] = useState(customHorizonAddress)
  const [sorobanRPCAddress, setSorobanRPCAddress] = useState(
    customSorobanRPCAddress,
  )

  const isCustomButtonActive: boolean =
    isValidUrl(horizonAddress) && isValidUrl(sorobanRPCAddress)

  const handleClear: MouseEventHandler<HTMLElement> = (event: FormEvent) => {
    event.preventDefault()
    setHorizonAddress('')
    setSorobanRPCAddress('')
  }

  const handleClose = () => setShow(false)

  const handleClick = (event: any) => {
    event.preventDefault()
    setShow(true)
  }

  return (
    <span>
      <CustomNetworkButton
        isActive={isCustomButtonActive}
        handleClickFn={handleClick}
      />
      {show && (
        <ResourceModal
          handleClearFn={handleClear}
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
