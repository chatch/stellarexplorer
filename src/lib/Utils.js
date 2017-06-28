import {sdk} from './Stellar'
import _ from 'lodash'

const isAccount = accStr => sdk.StrKey.isValidEd25519PublicKey(accStr)
const isDefInt = (obj, key) => obj[key] && Number.isInteger(Number(obj[key]))
const isTxHash = hashStr => /^[0-9a-f]{64}$/i.test(hashStr)
const shortHash = hash => _.truncate(hash, {length: 10})

export {isDefInt, isAccount, isTxHash, shortHash}
