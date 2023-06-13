/* eslint no-bitwise: ["error", {"allow": ["<<"]}] */

import base32 from 'base32.js'
import crc from 'crc'
import isUndefined from 'lodash/isUndefined'
import isNull from 'lodash/isNull'
import isString from 'lodash/isString'

const versionBytes = {
  ed25519PublicKey: 6 << 3, // G (when encoded in base32)
  ed25519SecretSeed: 18 << 3, // S
  med25519PublicKey: 12 << 3, // M
  preAuthTx: 19 << 3, // T
  sha256Hash: 23 << 3, // X
  signedPayload: 15 << 3, // P
  contract: 2 << 3, // C
}

const strkeyTypes = {
  G: 'ed25519PublicKey',
  S: 'ed25519SecretSeed',
  M: 'med25519PublicKey',
  T: 'preAuthTx',
  X: 'sha256Hash',
  P: 'signedPayload',
  C: 'contract',
}

// From: stellar-base/lib/util/checksum.js
export function verifyChecksum(expected, actual) {
    if (expected.length !== actual.length) {
      return false
    }
  
    if (expected.length === 0) {
      return true
    }
  
    for (let i = 0; i < expected.length; i += 1) {
      if (expected[i] !== actual[i]) {
        return false
      }
    }
  
    return true
  }

/**
 * StrKey is a helper class that allows encoding and decoding Stellar keys
 * to/from strings, i.e. between their binary (Buffer, xdr.PublicKey, etc.) and
 * string (i.e. "GABCD...", etc.) representations.
 */
export class StrKey {
  /**
   * Encodes `data` to strkey ed25519 public key.
   *
   * @param   {Buffer} data   raw data to encode
   * @returns {string}        "G..." representation of the key
   */
  static encodeEd25519PublicKey(data) {
    return encodeCheck('ed25519PublicKey', data)
  }

  /**
   * Decodes strkey ed25519 public key to raw data.
   *
   * If the parameter is a muxed account key ("M..."), this will only encode it
   * as a basic Ed25519 key (as if in "G..." format).
   *
   * @param   {string} data   "G..." (or "M...") key representation to decode
   * @returns {Buffer}        raw key
   */
  static decodeEd25519PublicKey(data) {
    return decodeCheck('ed25519PublicKey', data)
  }

  /**
   * Returns true if the given Stellar public key is a valid ed25519 public key.
   * @param {string} publicKey public key to check
   * @returns {boolean}
   */
  static isValidEd25519PublicKey(publicKey) {
    return isValid('ed25519PublicKey', publicKey)
  }

  /**
   * Encodes data to strkey ed25519 seed.
   * @param {Buffer} data data to encode
   * @returns {string}
   */
  static encodeEd25519SecretSeed(data) {
    return encodeCheck('ed25519SecretSeed', data)
  }

  /**
   * Decodes strkey ed25519 seed to raw data.
   * @param {string} address data to decode
   * @returns {Buffer}
   */
  static decodeEd25519SecretSeed(address) {
    return decodeCheck('ed25519SecretSeed', address)
  }

  /**
   * Returns true if the given Stellar secret key is a valid ed25519 secret seed.
   * @param {string} seed seed to check
   * @returns {boolean}
   */
  static isValidEd25519SecretSeed(seed) {
    return isValid('ed25519SecretSeed', seed)
  }

  /**
   * Encodes data to strkey med25519 public key.
   * @param {Buffer} data data to encode
   * @returns {string}
   */
  static encodeMed25519PublicKey(data) {
    return encodeCheck('med25519PublicKey', data)
  }

  /**
   * Decodes strkey med25519 public key to raw data.
   * @param {string} address data to decode
   * @returns {Buffer}
   */
  static decodeMed25519PublicKey(address) {
    return decodeCheck('med25519PublicKey', address)
  }

  /**
   * Returns true if the given Stellar public key is a valid med25519 public key.
   * @param {string} publicKey public key to check
   * @returns {boolean}
   */
  static isValidMed25519PublicKey(publicKey) {
    return isValid('med25519PublicKey', publicKey)
  }

  /**
   * Encodes data to strkey preAuthTx.
   * @param {Buffer} data data to encode
   * @returns {string}
   */
  static encodePreAuthTx(data) {
    return encodeCheck('preAuthTx', data)
  }

  /**
   * Decodes strkey PreAuthTx to raw data.
   * @param {string} address data to decode
   * @returns {Buffer}
   */
  static decodePreAuthTx(address) {
    return decodeCheck('preAuthTx', address)
  }

  /**
   * Encodes data to strkey sha256 hash.
   * @param {Buffer} data data to encode
   * @returns {string}
   */
  static encodeSha256Hash(data) {
    return encodeCheck('sha256Hash', data)
  }

  /**
   * Decodes strkey sha256 hash to raw data.
   * @param {string} address data to decode
   * @returns {Buffer}
   */
  static decodeSha256Hash(address) {
    return decodeCheck('sha256Hash', address)
  }

  /**
   * Encodes raw data to strkey signed payload (P...).
   * @param   {Buffer} data  data to encode
   * @returns {string}
   */
  static encodeSignedPayload(data) {
    return encodeCheck('signedPayload', data)
  }

  /**
   * Decodes strkey signed payload (P...) to raw data.
   * @param   {string} address  address to decode
   * @returns {Buffer}
   */
  static decodeSignedPayload(address) {
    return decodeCheck('signedPayload', address)
  }

  /**
   * Checks validity of alleged signed payload (P...) strkey address.
   * @param   {string} address  signer key to check
   * @returns {boolean}
   */
  static isValidSignedPayload(address) {
    return isValid('signedPayload', address)
  }

  /**
   * Encodes raw data to strkey contract (C...).
   * @param   {Buffer} data  data to encode
   * @returns {string}
   */
  static encodeContract(data) {
    return encodeCheck('contract', data)
  }

  /**
   * Decodes strkey contract (C...) to raw data.
   * @param   {string} address  address to decode
   * @returns {Buffer}
   */
  static decodeContract(address) {
    return decodeCheck('contract', address)
  }

  /**
   * Checks validity of alleged contract (C...) strkey address.
   * @param   {string} address  signer key to check
   * @returns {boolean}
   */
  static isValidContract(address) {
    return isValid('contract', address)
  }

  static getVersionByteForPrefix(address) {
    return strkeyTypes[address[0]]
  }
}

/**
 * Sanity-checks whether or not a strkey *appears* valid.
 *
 * @param  {string}  versionByteName the type of strkey to expect in `encoded`
 * @param  {string}  encoded         the strkey to validate
 *
 * @return {Boolean} whether or not the `encoded` strkey appears valid for the
 *     `versionByteName` strkey type (see `versionBytes`, above).
 *
 * @note This isn't a *definitive* check of validity, but rather a best-effort
 *     check based on (a) input length, (b) whether or not it can be decoded,
 *     and (c) output length.
 */
function isValid(versionByteName, encoded) {
  if (!isString(encoded)) {
    return false
  }

  // basic length checks on the strkey lengths
  switch (versionByteName) {
    case 'ed25519PublicKey': // falls through
    case 'ed25519SecretSeed': // falls through
    case 'preAuthTx': // falls through
    case 'sha256Hash': // falls through
    case 'contract':
      if (encoded.length !== 56) {
        return false
      }
      break

    case 'med25519PublicKey':
      if (encoded.length !== 69) {
        return false
      }
      break

    case 'signedPayload':
      if (encoded.length < 56 || encoded.length > 165) {
        return false
      }
      break

    default:
      return false
  }

  let decoded = ''
  try {
    decoded = decodeCheck(versionByteName, encoded)
  } catch (err) {
    return false
  }

  // basic length checks on the resulting buffer sizes
  switch (versionByteName) {
    case 'ed25519PublicKey': // falls through
    case 'ed25519SecretSeed': // falls through
    case 'preAuthTx': // falls through
    case 'sha256Hash': // falls through
    case 'contract':
      return decoded.length === 32

    case 'med25519PublicKey':
      return decoded.length === 40 // +8 bytes for the ID

    case 'signedPayload':
      return (
        // 32 for the signer, +4 for the payload size, then either +4 for the
        // min or +64 for the max payload
        decoded.length >= 32 + 4 + 4 && decoded.length <= 32 + 4 + 64
      )

    default:
      return false
  }
}

export function decodeCheck(versionByteName, encoded) {
  if (!isString(encoded)) {
    throw new TypeError('encoded argument must be of type String')
  }

  const decoded = base32.decode(encoded)
  const versionByte = decoded[0]
  const payload = decoded.slice(0, -2)
  const data = payload.slice(1)
  const checksum = decoded.slice(-2)

  if (encoded !== base32.encode(decoded)) {
    throw new Error('invalid encoded string')
  }

  const expectedVersion = versionBytes[versionByteName]

  if (isUndefined(expectedVersion)) {
    throw new Error(
      `${versionByteName} is not a valid version byte name. ` +
        `Expected one of ${Object.keys(versionBytes).join(', ')}`
    )
  }

  if (versionByte !== expectedVersion) {
    throw new Error(
      `invalid version byte. expected ${expectedVersion}, got ${versionByte}`
    )
  }

  const expectedChecksum = calculateChecksum(payload)

  if (!verifyChecksum(expectedChecksum, checksum)) {
    throw new Error('invalid checksum')
  }

  return Buffer.from(data)
}

export function encodeCheck(versionByteName, data) {
  if (isNull(data) || isUndefined(data)) {
    throw new Error('cannot encode null data')
  }

  const versionByte = versionBytes[versionByteName]

  if (isUndefined(versionByte)) {
    throw new Error(
      `${versionByteName} is not a valid version byte name. ` +
        `Expected one of ${Object.keys(versionBytes).join(', ')}`
    )
  }
  data = Buffer.from(data)

  const versionBuffer = Buffer.from([versionByte])
  const payload = Buffer.concat([versionBuffer, data])
  const checksum = calculateChecksum(payload)
  const unencoded = Buffer.concat([payload, checksum])

  return base32.encode(unencoded)
}

// Computes the CRC16-XModem checksum of `payload` in little-endian order
function calculateChecksum(payload) {
  const checksum = Buffer.alloc(2)
  checksum.writeUInt16LE(crc.crc16xmodem(payload), 0)
  return checksum
}
