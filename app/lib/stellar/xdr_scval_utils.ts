import { StrKey, xdr } from 'soroban-client'

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
