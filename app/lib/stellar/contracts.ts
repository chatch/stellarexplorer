import { Contract } from 'stellar-sdk'
import type { SorobanServer } from '../stellar'
import { xdr } from '../stellar'
import { hexStringToBytes } from '../utils'
import { scValToString } from './xdr_scval_utils'
import ContractIdInvalid from '../error/ContractIdInvalid'

const API_URL = 'https://steexp-api.fly.dev'
// const API_URL = `http://localhost:3001`

interface ContractProps {
  id: string
  wasmId: string
  wasmIdLedger: string
  wasmCode: string
  wasmCodeLedger: string
}

interface StorageElement {
  key: string
  keyType: string
  value: string
  valueType: string
}

const convertStorage = (
  storage: ReadonlyArray<xdr.ScMapEntry>,
): ReadonlyArray<StorageElement> =>
  storage.map((el) => ({
    key: scValToString(el.key()),
    keyType: el.key().switch().name,
    value: scValToString(el.val()),
    valueType: el.val().switch().name,
  }))

const getContractInfo = async (server: SorobanServer, contractId: string) => {
  const ledgerKey = xdr.LedgerKey.contractData(
    new xdr.LedgerKeyContractData({
      contract: new Contract(contractId).address().toScAddress(),
      key: xdr.ScVal.scvLedgerKeyContractInstance(),
      durability: xdr.ContractDataDurability.persistent(),
    }),
  )

  let ledgerEntries
  try {
    ledgerEntries = await server.getLedgerEntries(ledgerKey)
  } catch (error) {
    console.error(error)
  }

  if (
    ledgerEntries == null ||
    ledgerEntries.entries == null ||
    ledgerEntries.entries.length === 0
  ) {
    return null
  }
  const ledgerEntry = ledgerEntries.entries[0]
  const codeData = ledgerEntry.val.contractData()

  const wasmIdLedger = ledgerEntry.lastModifiedLedgerSeq

  const contractInstance = codeData.val().instance()
  const wasmId = contractInstance.executable().wasmHash()

  const contractStorage = contractInstance.storage()
  const storage = contractStorage ? convertStorage(contractStorage) : []

  return { wasmId, wasmIdLedger, storage }
}

const getContractCode = async (
  server: SorobanServer,
  wasmId: Buffer,
): Promise<{ wasmCode: string; wasmCodeLedger: number } | null> => {
  const ledgerKey = xdr.LedgerKey.contractCode(
    new xdr.LedgerKeyContractCode({
      hash: wasmId,
    }),
  )
  const ledgerEntries = await server.getLedgerEntries(ledgerKey)
  if (
    ledgerEntries == null ||
    ledgerEntries.entries == null ||
    ledgerEntries.entries.length === 0
  ) {
    return null
  }
  const ledgerEntry = ledgerEntries.entries[0]

  const wasmCodeLedger = ledgerEntry.lastModifiedLedgerSeq as number

  const codeEntry = ledgerEntry.val.contractCode()
  const wasmCode = codeEntry.code().toString('hex')

  return { wasmCode, wasmCodeLedger }
}

const loadContract = async (
  server: SorobanServer,
  contractId: string,
): Promise<ContractProps | undefined> => {
  let contractInstance
  try {
    contractInstance = new Contract(contractId)
  } catch (error) {
    console.error(error)
    if (
      error instanceof Error &&
      error.message.includes('Invalid contract ID')
    ) {
      throw new ContractIdInvalid(contractId)
    }
    throw error
  }

  const wasmIdResult = await getContractInfo(server, contractId)
  if (wasmIdResult == null) {
    console.error('Failed to get wasm id')
    return
  }

  const { wasmId, wasmIdLedger } = wasmIdResult
  // console.log(`wasmIdResult ${JSON.stringify(wasmIdResult, null, 2)}`)
  if (!wasmId) {
    console.warn('no wasmId in result')
    return
  }

  const codeResult = await getContractCode(server, wasmId)
  if (!codeResult) {
    console.error('Failed to get wasm code')
    return
  }
  const { wasmCode, wasmCodeLedger } = codeResult

  return {
    id: contractInstance.contractId(),
    wasmId: wasmId.toString('hex'),
    wasmIdLedger: String(wasmIdLedger),
    wasmCode,
    wasmCodeLedger: String(wasmCodeLedger),
  }
}

const postWasmToWabtBackendRoute =
  (path: string) =>
  (wasmHexString: string): Promise<string> => {
    const wasmBytes = hexStringToBytes(wasmHexString)
    const blob = new Blob([new Uint8Array(wasmBytes)])
    const formData = new FormData()
    formData.append('contract', blob)
    return fetch(`${API_URL}${path}`, {
      method: 'POST',
      body: formData,
    }).then((response) => response.text())
  }

const getContractDecompiled = postWasmToWabtBackendRoute('/decompile')
const getContractWat = postWasmToWabtBackendRoute('/wat')

const getContractInterface = (
  wasmHexString: string,
): Promise<Record<string, string>> => {
  const wasmBytes = hexStringToBytes(wasmHexString)
  const blob = new Blob([new Uint8Array(wasmBytes)])
  const formData = new FormData()
  formData.append('contract', blob)
  return fetch(`${API_URL}/interface`, {
    method: 'POST',
    body: formData,
  }).then((response) => response.json())
}

export type { ContractProps, StorageElement }

export {
  getContractCode,
  getContractInfo,
  getContractDecompiled,
  getContractInterface,
  getContractWat,
  loadContract,
}
