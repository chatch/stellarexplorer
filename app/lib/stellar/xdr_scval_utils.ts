import { StrKey, scValToNative, xdr } from 'soroban-client'

export function scValToAddress(
    scval: any // : SorobanClient.xdr.ScVal | undefined
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

export const scValToString = (scVal: any) => {
    console.log(`type ${scVal.switch ? scVal.switch().name : 'unknown'}`)
    const native = scValToNative(scVal)
    console.log(`type: ${typeof native} val: ${native}`)
    if (typeof native === 'string') {
        return native
    } else if (typeof native === 'bigint') {
        return native.toString()
    } else {
        return JSON.stringify(native)
    }
}