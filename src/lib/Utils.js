import {sdk} from './Stellar'
import truncate from 'lodash/truncate'

const isAccount = accStr => sdk.StrKey.isValidEd25519PublicKey(accStr)
const isDefInt = (obj, key) => obj[key] && Number.isInteger(Number(obj[key]))
const isTxHash = hashStr => /^[0-9a-f]{64}$/i.test(hashStr)
const shortHash = hash => truncate(hash, {length: 10})

const handleFetchDataFailure = id => e => {
  let msg = `Failed to fetch data:`
  if (e.data && e.data.status) msg += `\n\tStatus: [${e.data.status}]`
  if (e.message) msg += `\n\tMessage: [${e.message}]`
  if (e.stack) msg += `\n\tStack: [${e.stack}]`
  console.error(msg)

  if (e.data.status === 404) {
    let redirectURI = '/error/not-found'
    if (id) redirectURI += `/${id}`
    window.location.href = redirectURI
  }
}

const storageInit = () => {
  let storage
  if (typeof localStorage === 'undefined' || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage
    storage = new LocalStorage('./stellarexplorer')
  } else {
    storage = localStorage
  }
  return storage
}

export {
  handleFetchDataFailure,
  isDefInt,
  isAccount,
  isTxHash,
  shortHash,
  storageInit,
}
