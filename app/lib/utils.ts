import BigNumber from 'bignumber.js'
import truncate from 'lodash/truncate'

const Buffer = require('buffer').Buffer

// Amounts in Stellar don't go below 7 decimals
// So setting the EXPONENTIAL_AT to 8 here ensures all toString() will show the
// numbers in full form. eg. 0.0000001 (not 1e7) which is what we want for
// formatAmount().
BigNumber.config({ EXPONENTIAL_AT: 20 })

const shortAddress = (address: string, length = 4) =>
  address ? address.substring(0, length) : ''

const shortHash = (hash: string, length = 10) => truncate(hash, { length })

const isDefInt = (obj: Record<string, any>, key: string) => {
  if (!obj || !key || obj.hasOwnProperty(key) === false) return false
  return Number.isInteger(Number(obj[key]))
}

const base64Decode = (value: string) => Buffer.from(value, 'base64').toString()
const base64DecodeToHex = (value: string) =>
  Buffer.from(value, 'base64').toString('hex')

// Extract asset issuer address from keys in the form <code>-<issuer>
const assetKeyToIssuer = (key: string) => key.substring(key.indexOf('-') + 1)

const storageInit = () => {
  let storage
  if (typeof localStorage === 'undefined' || localStorage === null) {
    // const storagePath = join(tmpdir(), 'steexp')
    // TODO: change this ..
    // const LocalStorage = require('node-localstorage').LocalStorage
    storage = {}
  } else {
    storage = localStorage
  }
  return storage
}

const formatAmount = (amount: string | number) => {
  return new BigNumber(amount).toString()
}

const setTitle = (subTitle: string) =>
  (document.title = `Stellar Explorer | ${subTitle}`)

const hexStringToBytes = (hexString: string) => {
  const bytes = new Uint8Array(hexString.length / 2)
  for (let i = 0; i < hexString.length; i += 2) {
    const byte = parseInt(hexString.substring(i, i + 2), 16)
    bytes[i / 2] = byte
  }
  return bytes.buffer
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

export {
  assetKeyToIssuer,
  base64Decode,
  base64DecodeToHex,
  formatAmount,
  hexStringToBytes,
  isDefInt,
  isValidUrl,
  setTitle,
  shortAddress,
  shortHash,
  storageInit,
}
