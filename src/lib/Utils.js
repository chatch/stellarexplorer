import {sdk} from './Stellar'

function isDefInt(obj, key) {
  return (obj[key] && Number.isInteger(Number(obj[key])))
}

function isAccount(accStr) {
  return sdk.StrKey.isValidEd25519PublicKey(accStr)
}

function isTxHash(hashStr) {
  return /^[0-9a-f]{64}$/i.test(hashStr)
}

function shortHash(hash) {
  return hash.substring(0, 10) + "..."
}

export {isDefInt, isAccount, isTxHash, shortHash}
