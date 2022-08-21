import {StrKey} from 'stellar-base/lib/strkey'

const STROOPS_PER_LUMEN = 10000000
const stroopsToLumens = stroops => stroops / STROOPS_PER_LUMEN

// stellar federated address (eg. "stellar*fed.network")
const isStellarAddress = addr => /^[^*,]*\*[a-z0-9-.]*$/i.test(addr)
const isPublicKey = keyStr => StrKey.isValidEd25519PublicKey(keyStr)
const isSecretKey = keyStr => StrKey.isValidEd25519SecretSeed(keyStr)
const isTxHash = hashStr => /^[0-9a-f]{64}$/i.test(hashStr)

export {isPublicKey, isSecretKey, isStellarAddress, isTxHash, stroopsToLumens}
