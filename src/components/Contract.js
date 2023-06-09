import truncate from 'lodash/truncate'
import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Table from 'react-bootstrap/lib/Table'

import {injectIntl, FormattedMessage} from 'react-intl'
import {saveAs} from '../lib/filesaver'
import {Contract as SorobanContract} from '../lib/stellar/contract'
import {xdr} from '../lib/stellar'
import {handleFetchDataFailure} from '../lib/utils'
import ClipboardCopy from './shared/ClipboardCopy'
import {withSorobanServer} from './shared/HOCs'
import {withSpinner} from './shared/Spinner'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

function hexStringToBytes(hexString) {
  const bytes = new Uint8Array(hexString.length / 2)
  for (let i = 0; i < hexString.length; i += 2) {
    const byte = parseInt(hexString.substring(i, i + 2), 16)
    bytes[i / 2] = byte
  }
  return bytes.buffer
}
const saveWasmFile = (contractId, wasmHexString) =>
  saveAs(
    new Blob([hexStringToBytes(wasmHexString)], {
      type: 'application/octet-stream',
    }),
    `soroban-contract-${contractId}.wasm`,
    true // don't insert a byte order marker
  )

const getContractWasmId = (server, contractId) => {
  const ledgerKey = xdr.LedgerKey.contractData(
    new xdr.LedgerKeyContractData({
      contractId: Buffer.from(contractId, 'hex'),
      key: xdr.ScVal.scvLedgerKeyContractExecutable(),
    })
  )
  return server
    .getLedgerEntry(ledgerKey)
    .then((data) =>
      xdr.LedgerEntryData.fromXDR(data.xdr, 'base64')
        .contractData()
        .val()
        .exec()
        .wasmId()
    )
    .catch(handleFetchDataFailure(contractId))
}

const getContractWasmCode = (server, wasmId) => {
  const ledgerKey = xdr.LedgerKey.contractCode(
    new xdr.LedgerKeyContractCode({
      hash: wasmId,
    })
  )
  return server.getLedgerEntry(ledgerKey).then((data) => {
    return xdr.LedgerEntryData.fromXDR(data.xdr, 'base64').contractCode().code()
  })
}

const DetailRow = ({label, children}) => (
  <tr>
    <td>
      <FormattedMessage id={label} />
    </td>
    <td>{children}</td>
  </tr>
)

class Contract extends React.Component {
  render() {
    const {id, idHex, wasmId, wasmCode} = this.props

    const {formatMessage} = this.props.intl

    return (
      <Grid>
        <Row>
          <Panel
            header={titleWithJSONButton(
              <span>
                {formatMessage({id: 'contract'})}{' '}
                <span className="secondary-heading">{id}</span>
                <ClipboardCopy text={id} />
              </span>
            )}
          >
            <Table>
              <tbody>
                <DetailRow label="contract.id.hex">
                  <span>
                    {idHex}
                    <ClipboardCopy text={idHex} />
                  </span>
                </DetailRow>
                <DetailRow label="contract.wasm.id">
                  <span>
                    {wasmId}
                    <ClipboardCopy text={wasmId} />
                  </span>
                </DetailRow>
                <DetailRow label="contract.wasm.bytecode">
                  <div id="wasm-code">
                    <div>{truncate(wasmCode, {length:60})}</div>
                    <div>
                      <button
                        className="backend-resource-badge-button"
                        onClick={() => saveWasmFile(id, wasmCode)}
                        style={{border: 0, marginTop: '10px'}}
                      >
                        <FormattedMessage id="contract.wasm.download"/>
                      </button>
                    </div>
                  </div>
                </DetailRow>
              </tbody>
            </Table>
          </Panel>
        </Row>
      </Grid>
    )
  }
}

const ContractWithSpinner = withSpinner()(Contract)

class ContractContainer extends React.Component {
  state = {
    isLoading: true,
    id: this.props.match.params.id,
  }

  componentDidMount() {
    this.loadContract(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    this.loadContract(nextProps.match.params.id)
  }

  async loadContract(contractId) {
    console.log('loadContract', contractId)
    let contractInstance
    try {
      contractInstance = new SorobanContract(contractId)
    } catch (error) {
      // TODO: should be inside a utils function - see handleFetchDataFailure
      //   and look to split out not found redirect into another function
      window.location.href = `/error/not-found/${contractId}`
    }

    const wasmId = await getContractWasmId(
      this.props.sorobanServer,
      contractInstance.contractId('hex')
    )
    if (!wasmId) {
      console.error('Failed to get wasm id')
      return
    }

    const wasmCode = await getContractWasmCode(this.props.sorobanServer, wasmId)
    if (!wasmCode) {
      console.error('Failed to get wasm code')
      return
    }

    this.setState({
      id: contractInstance.contractId(),
      idHex: contractInstance.contractId('hex'),
      wasmId: wasmId.toString('hex'),
      wasmCode: wasmCode.toString('hex'),
      isLoading: false,
    })
  }

  render() {
    return this.state.seq === 0 ? null : (
      <ContractWithSpinner {...this.state} {...this.props} />
    )
  }
}

export default injectIntl(withSorobanServer(ContractContainer))
