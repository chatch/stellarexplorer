import { sdk } from './Stellar'

function isDefInt(obj, key) {
    return (obj[key] && Number.isInteger(Number(obj[key])))
}

function isAccount(accStr) {
    return sdk.StrKey.isValidEd25519PublicKey(accStr)
}

export { isDefInt, isAccount }
