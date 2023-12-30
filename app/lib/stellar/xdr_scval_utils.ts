import { StrKey, scValToNative, xdr } from 'stellar-sdk'

const Buffer = require('buffer').Buffer

export function scValToAddress(
  scval: any, // : SorobanClient.xdr.ScVal | undefined
): string {
  const addr = scval.address()
  switch (addr.switch()) {
    case xdr.ScAddressType.scAddressTypeAccount():
      return StrKey.encodeEd25519PublicKey(addr.accountId().ed25519())
    case xdr.ScAddressType.scAddressTypeContract():
      return StrKey.encodeContract(addr.contractId())
    default:
      return 'unknown address type ...'
  }
}

/**
 * Takes a value returned by scValToNative (some js type) and converts it to a string.
 *
 * Handles:
 *  - bigint - JSON.stringify can't handle it
 *  - Buffer - ensure hex string returned
 *  - values nested in objects or arrays
 *
 * @param native some javascript value to be converted to a string
 * @returns string representation
 */
const jsNativeValToString = (native: any): string => {
  //   console.log(`type=${typeof native}`)
  if (typeof native === 'string') {
    return native
  } else if (typeof native === 'bigint') {
    return native.toString()
  } else if (Array.isArray(native)) {
    return JSON.stringify(native.map((val) => jsNativeValToString(val)))
  } else if (typeof native === 'object') {
    return jsNativeObjectValToString(native)
  } else if (Buffer.isBuffer(native)) {
    return native.toString('hex')
  } else {
    return JSON.stringify(native)
  }
}

const jsNativeObjectValToString = (native: any): string => {
  const convertedObj: Record<string, string> = {}
  for (const [objKey, objVal] of Object.entries(native)) {
    // console.log(`key ${JSON.stringify(objKey, null, 2)}`)
    convertedObj[objKey] = jsNativeValToString(objVal)
  }
  return JSON.stringify(convertedObj)
}

export const scValToString = (scVal: any): string => {
  const native = scValToNative(scVal)
  if (native == null) {
    return 'void'
  }
  return jsNativeValToString(native)
}
