import {StrKey as SorobanStrKey} from 'soroban-client'

import {StrKey} from './sdk'

const STROOPS_PER_LUMEN = 10000000
const stroopsToLumens = stroops => stroops / STROOPS_PER_LUMEN

const isContractAddress = addr => SorobanStrKey.isValidContract(addr)
// stellar federated address (eg. "stellar*fed.network")
const isFederatedAddress = addr => /^[^*,]*\*[a-z0-9-.]*$/i.test(addr)
const isMuxedAddress = addr => StrKey.isValidMed25519PublicKey(addr)
const isPublicKey = keyStr => StrKey.isValidEd25519PublicKey(keyStr)
const isSecretKey = keyStr => StrKey.isValidEd25519SecretSeed(keyStr)
const isTxHash = hashStr => /^[0-9a-f]{64}$/i.test(hashStr)

export {
  isContractAddress,
  isFederatedAddress,
  isMuxedAddress,
  isPublicKey,
  isSecretKey,
  isTxHash,
  stroopsToLumens,
}
