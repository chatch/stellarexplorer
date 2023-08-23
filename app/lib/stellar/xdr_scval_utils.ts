import BigNumber from 'bignumber.js'
import bigInt from 'big-integer'
import { StrKey, xdr } from 'soroban-client'

// function copied from https://github.com/stellar/soroban-example-dapp/blob/main/convert.ts
// License: Apache 2.0
export function scvalToBigNumber(
    scval: any // : xdrStellarBase.ScVal | undefined
): BigNumber {
    switch (scval.switch()) {
        case undefined: {
            return BigNumber(0)
        }
        case xdr.ScValType.scvU32(): {
            return BigNumber(scval.u32())
        }
        case xdr.ScValType.scvI32(): {
            return BigNumber(scval.i32())
        }
        case xdr.ScValType.scvU64(): {
            const { high, low } = scval.u64()
            return bigNumberFromBytes(false, high, low)
        }
        case xdr.ScValType.scvI64(): {
            const { high, low } = scval.i64()
            return bigNumberFromBytes(true, high, low)
        }
        case xdr.ScValType.scvU128(): {
            const parts = scval.u128()
            const a = parts.hi()
            const b = parts.lo()
            return bigNumberFromBytes(false, a.high, a.low, b.high, b.low)
        }
        case xdr.ScValType.scvI128(): {
            const parts = scval.i128()
            const a = parts.hi()
            const b = parts.lo()
            return bigNumberFromBytes(true, a.high, a.low, b.high, b.low)
        }
        case xdr.ScValType.scvU256(): {
            const parts = scval.u256()
            const a = parts.hiHi()
            const b = parts.hiLo()
            const c = parts.loHi()
            const d = parts.loLo()
            return bigNumberFromBytes(
                false,
                a.high,
                a.low,
                b.high,
                b.low,
                c.high,
                c.low,
                d.high,
                d.low
            )
        }
        case xdr.ScValType.scvI256(): {
            const parts = scval.i256()
            const a = parts.hiHi()
            const b = parts.hiLo()
            const c = parts.loHi()
            const d = parts.loLo()
            return bigNumberFromBytes(
                true,
                a.high,
                a.low,
                b.high,
                b.low,
                c.high,
                c.low,
                d.high,
                d.low
            )
        }
        default: {
            throw new Error(
                `Invalid type for scvalToBigNumber: ${scval.switch().name}`
            )
        }
    }
}

// function copied from https://github.com/stellar/soroban-example-dapp/blob/main/convert.ts
// License: Apache 2.0
function bigNumberFromBytes(
    signed: boolean,
    ...bytes: (string | number | bigint)[]
): BigNumber {
    let sign = 1
    if (signed && bytes[0] === 0x80) {
        // top bit is set, negative number.
        sign = -1
        bytes[0] &= 0x7f
    }
    let b = bigInt.zero
    for (let byte of bytes) {
        b = b.shiftLeft(8).or(byte)
    }
    return BigNumber(b.toString()).multipliedBy(sign)
}

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
