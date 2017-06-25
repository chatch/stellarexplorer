import React from 'react'
import {sdk} from './Stellar'

const isAccount = accStr => sdk.StrKey.isValidEd25519PublicKey(accStr)
const isDefInt = (obj, key) => obj[key] && Number.isInteger(Number(obj[key]))
const isTxHash = hashStr => /^[0-9a-f]{64}$/i.test(hashStr)

const shortHash = hash => hash.substring(0, 10) + '...'

const titleWithRightJustifiedLink = (title, rightLinkLabel, rightLinkAddr) =>
  <div>
    <span>{title}</span>
    <a href={rightLinkAddr} className="pull-right">{rightLinkLabel}</a>
  </div>

export {isDefInt, isAccount, isTxHash, titleWithRightJustifiedLink, shortHash}
