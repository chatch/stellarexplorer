import isNaN from 'lodash/isNaN'
import isString from 'lodash/isString'
import toNumber from 'lodash/toNumber'

import {isPublicKey, isStellarAddress, isTxHash} from './utils'

const searchStrToPath = searchStr => {
  if (!isString(searchStr) || searchStr.trim() === '') return null

  const str = searchStr.trim()

  let path = null
  if (isPublicKey(str) || isStellarAddress(str)) {
    path = `/account/${str}`
  } else if (isTxHash(str)) {
    path = `/tx/${str}`
  } else if (!isNaN(toNumber(str))) {
    path = `/ledger/${toNumber(str)}`
  } else {
    path = `/error/not-found/${searchStr}`
  }
  return path
}

export {searchStrToPath}
