import { StrKey } from 'stellar-sdk'

const STROOPS_PER_LUMEN = 10000000
const stroopsToLumens = (stroops: number) => stroops / STROOPS_PER_LUMEN

// remove 'as any' when isValidContract is added to the StrKey type in stellar-base
const isContractAddress = (addr: string) =>
  (StrKey as any).isValidContract(addr)
// stellar federated address (eg. "stellar*fed.network")
const isFederatedAddress = (addr: string) => /^[^*,]*\*[a-z0-9-.]*$/i.test(addr)
const isMuxedAddress = (addr: string) => StrKey.isValidMed25519PublicKey(addr)
const isPublicKey = (keyStr: string) => StrKey.isValidEd25519PublicKey(keyStr)
const isSecretKey = (keyStr: string) => StrKey.isValidEd25519SecretSeed(keyStr)
const isTxHash = (hashStr: string) => /^[0-9a-f]{64}$/i.test(hashStr)

const isLocalhost = (address: string) =>
  typeof address === 'string' &&
  (address.includes('//localhost') ||
    address.includes('//0.0.0.0') ||
    address.includes('//127.'))

export {
  isContractAddress,
  isFederatedAddress,
  isLocalhost,
  isMuxedAddress,
  isPublicKey,
  isSecretKey,
  isTxHash,
  stroopsToLumens,
}
