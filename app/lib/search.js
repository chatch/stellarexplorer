import isNaN from 'lodash/isNaN'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import toNumber from 'lodash/toNumber'
import { Keypair } from 'stellar-sdk'

import {
  isContractAddress,
  isFederatedAddress,
  isMuxedAddress,
  isPublicKey,
  isSecretKey,
  isTxHash,
} from './stellar/utils'
import directory from '../data/directory'
import { isPathClaimableBalance } from './utilities'

const { anchors, assets } = directory

const lcEquals = (str1, str2) =>
  !isEmpty(str1) && !isEmpty(str2) && str1.toLowerCase() === str2.toLowerCase()

const lcIncludes = (str1, str2) =>
  !isEmpty(str1) &&
  !isEmpty(str2) &&
  str1.toLowerCase().includes(str2.toLowerCase())

const searchAssetCode = (code) =>
  Object.keys(assets)
    .filter((key) => lcEquals(assets[key].code, code))
    .map((key) => assets[key])

const searchAnchorName = (name) =>
  Object.keys(anchors).filter(
    (key) =>
      lcIncludes(anchors[key].name, name) ||
      lcIncludes(anchors[key].displayName, name),
  )

const searchStrToPath = (searchStr, pathName) => {
  if (!isString(searchStr) || searchStr.trim() === '') return null

  const str = searchStr.trim()

  // see stellar-base StrKey - new functions for isValid on a contract
  //   prob copy over parts of that code
  // see also stellar-base new Contract(address or bytes)
  //
  if (isPublicKey(str) || isFederatedAddress(str) || isMuxedAddress(str)) {
    if (isPathClaimableBalance(pathName)) {
      return `/claimable-balances/${str}`
    } else {
      return `/account/${str}`
    }
  } else if (isTxHash(str)) {
    return `/tx/${str}`
  } else if (isContractAddress(str)) {
    return `/contract/${str}`
  } else if (!isNaN(toNumber(str))) {
    return `/ledger/${toNumber(str)}`
  } else if (isSecretKey(str)) {
    const kp = Keypair.fromSecret(str)
    return `/account/${kp.publicKey()}`
  }

  // search by asset code
  const codeMatch = searchAssetCode(str)
  if (codeMatch.length > 0) {
    return `/asset/${codeMatch[0].code}`
  }

  // search by anchor name (exact or substring)
  const nameMatch = searchAnchorName(str)
  if (nameMatch.length > 0) {
    return `/anchor/${nameMatch[0]}`
  }

  return `/error/not-found/${searchStr}`
}

export { searchStrToPath }
