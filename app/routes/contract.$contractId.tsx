import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { LoaderArgs, defer } from '@remix-run/node'
import { Await, useLoaderData } from '@remix-run/react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Table from 'react-bootstrap/Table'

import truncate from 'lodash/truncate'
import { Contract } from 'soroban-client'

import { saveAs } from '../lib/filesaver'
import { SorobanServer, xdr } from '../lib/stellar'
import { requestToSorobanServer } from '~/lib/stellar/server'
import { TitleWithJSONButton } from '~/components/shared/TitleWithJSONButton'
import ClipboardCopy from '~/components/shared/ClipboardCopy'

function hexStringToBytes(hexString: string) {
  const bytes = new Uint8Array(hexString.length / 2)
  for (let i = 0; i < hexString.length; i += 2) {
    const byte = parseInt(hexString.substring(i, i + 2), 16)
    bytes[i / 2] = byte
  }
  return bytes.buffer
}

const saveWasmFile = (contractId: string, wasmHexString: string) =>
  saveAs(
    new Blob([hexStringToBytes(wasmHexString)], {
      type: 'application/octet-stream',
    }),
    `soroban-contract-${contractId}.wasm`,
    true // don't insert a byte order marker
  )

const getContractInfo = async (
  server: SorobanServer,
  contractId: string
) => {
  const ledgerKey = xdr.LedgerKey.contractData(
    new xdr.LedgerKeyContractData({
      contract: new Contract(contractId).address().toScAddress(),
      key: xdr.ScVal.scvLedgerKeyContractInstance(),
      durability: xdr.ContractDataDurability.persistent(),
      bodyType: xdr.ContractEntryBodyType.dataEntry()
    })
  )

  const ledgerEntries = await server.getLedgerEntries([ledgerKey])
  if (ledgerEntries == null || ledgerEntries.entries == null) {
    return null
  }

  const ledgerEntry = ledgerEntries.entries[0]
  const codeData = xdr.LedgerEntryData.fromXDR(ledgerEntry.xdr, 'base64')
    .contractData().body().data()

  const wasmIdLedger = ledgerEntry.lastModifiedLedgerSeq

  const contractInstance = codeData.val().instance()
  const wasmId = contractInstance.executable().wasmHash()
  const storage = contractInstance.storage()

  return { wasmId, wasmIdLedger, storage }
}

const getContractCode = async (
  server: SorobanServer,
  wasmId: Buffer
) => {
  const ledgerKey = xdr.LedgerKey.contractCode(
    new xdr.LedgerKeyContractCode({
      hash: wasmId,
      bodyType: xdr.ContractEntryBodyType.dataEntry()
    })
  )
  const ledgerEntries = await server.getLedgerEntries([ledgerKey])
  if (ledgerEntries == null || ledgerEntries.entries == null) {
    return null
  }
  const ledgerEntry = ledgerEntries.entries[0]

  const wasmCodeLedger = ledgerEntry.lastModifiedLedgerSeq as number

  const codeEntry = xdr.LedgerEntryData.fromXDR(ledgerEntry.xdr, 'base64')
  const wasmCode = codeEntry.contractCode().body().code()

  return { wasmCode, wasmCodeLedger }
}

const DetailRow = ({ label, children }: { label: string, children: any }) => (
  <tr>
    <td>
      <FormattedMessage id={label} />
    </td>
    <td>{children}</td>
  </tr>
)

interface ContractProps {
  id: string
  wasmId: string
  wasmIdLedger: string
  wasmCode: string
  wasmCodeLedger: string
}

const loadContract = async (
  server: SorobanServer,
  contractId: string
): Promise<ContractProps | undefined> => {
  let contractInstance
  try {
    contractInstance = new Contract(contractId)
  } catch (error) {
    console.error(`CONTRACT NOT FOUND`)
    return
  }

  const wasmIdResult = await getContractInfo(
    server,
    contractId
  )
  if (wasmIdResult == null) {
    console.error('Failed to get wasm id')
    return
  }

  const { wasmId, wasmIdLedger, storage } = wasmIdResult
  if (!wasmId) {
    console.error('Failed to get wasm id')
    return
  }

  console.log(`RENDER storage`)

  const codeResult = await getContractCode(
    server,
    wasmId
  )
  if (!codeResult) {
    console.error('Failed to get wasm code')
    return
  }
  const { wasmCode, wasmCodeLedger } = codeResult

  return {
    id: contractInstance.contractId(),
    wasmId: wasmId.toString('hex'),
    wasmIdLedger: String(wasmIdLedger),
    wasmCode: wasmCode.toString('hex'),
    wasmCodeLedger: String(wasmCodeLedger),
  }
}

export const loader = ({ params, request }: LoaderArgs) => {
  const server = requestToSorobanServer(request)
  const response = Promise.all([
    loadContract(server, params.contractId as string),
    server.serverURL.toString()
  ]).then(result => ({ contractDetails: result[0], horizonURL: result[1] })).catch(console.error)
  return defer({ response })
}

export default function () {
  const { formatMessage } = useIntl()
  const { response } = useLoaderData<typeof loader>()

  return (
    <Container>
      <Row>
        <Suspense
          fallback={<p>Loading ...</p>}
        >
          <Await
            resolve={response}
            errorElement={
              <p>Error loading data</p>
            }
          >
            {({ contractDetails, horizonURL }) => {
              if (!contractDetails) {
                return (<span>Not Found</span>)
              }
              const {
                id,
                wasmId,
                wasmIdLedger,
                wasmCode,
                wasmCodeLedger
              } = contractDetails as ContractProps
              return (
                <Card>
                  <CardHeader>
                    <TitleWithJSONButton
                      title={formatMessage({ id: "contract" })}
                      titleSecondary={id}
                      url={`${horizonURL}/contracts/${id}`} />
                  </CardHeader>
                  <Card.Body>
                    <Table>
                      <tbody>
                        <DetailRow label="contract.create.ledger">
                          <Link to={`/ledger/${wasmIdLedger}`}>{wasmIdLedger}</Link>
                        </DetailRow>
                        <DetailRow label="contract.wasm.id">
                          <span>
                            {wasmId}
                            <ClipboardCopy text={wasmId} />
                          </span>
                        </DetailRow>
                        <DetailRow label="contract.wasm.upload.ledger">
                          <Link to={`/ledger/${wasmCodeLedger}`}>{wasmCodeLedger}</Link>
                        </DetailRow>
                        <DetailRow label="contract.wasm.bytecode">
                          <div id="wasm-code">
                            <div>{truncate(wasmCode, { length: 60 })}</div>
                            <div>
                              <button
                                className="backend-resource-badge-button"
                                onClick={() => saveWasmFile(id, wasmCode)}
                                style={{ border: 0, marginTop: '10px' }}
                              >
                                <FormattedMessage id="contract.wasm.download" />
                              </button>
                            </div>
                          </div>
                        </DetailRow>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )
            }}
          </Await>
        </Suspense>
      </Row>
    </Container>
  )
}

