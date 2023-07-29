import xdr from './xdr_soroban'
import {StrKey} from './strkey_soroban'

//
// From: stellar-base/src/contract.js
// 

/**
 * Create a new Contract object.
 *
 * `Contract` represents a single contract in the Stellar network, embodying the
 * interface of the contract. See
 * [Contracts](https://soroban.stellar.org/docs/learn/interacting-with-contracts)
 * for more information about how contracts work in Stellar.
 *
 * @constructor
 *
 * @param {string} contractId - ID of the contract (ex.
 *     `CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE`, or as a
 *     32-byte hex string
 *     `000000000000000000000000000000000000000000000000000000000000000001`).
 */
// TODO: Support contract deployment, maybe?
export class Contract {
  constructor(contractId) {
    try {
      // First, try it as a strkey
      this._id = StrKey.decodeContract(contractId)
    } catch (_) {
      // If that fails, try it as a hex string
      // TODO: Add methods based on the contractSpec (or do that elsewhere?)
      const b = Buffer.from(contractId, 'hex')
      if (b.length !== 32) {
        throw new Error('Invalid contract ID')
      }
      this._id = b
    }
  }

  /**
   * Returns Stellar contract ID as a strkey, or hex string, ex.
   * `000000000000000000000000000000000000000000000000000000000000000001`.
   * @param {'hex'|'strkey'} format - format of output, defaults to 'strkey'
   * @returns {string}
   */
  contractId(format = 'strkey') {
    switch (format) {
    case 'strkey':
      return StrKey.encodeContract(this._id)
    case 'hex':
      return this._id.toString('hex')
    default:
      throw new Error(`Invalid format: ${format}`)
    }
  }

  /**
   * Returns the address of this contract as an Address type.
   * @returns {Address}
   */
//   address() {
//     return Address.contract(this._id);
//   }

  /**
   * Returns an operation that will invoke this contract call.
   *
   * @todo Allow easily building `Operation`s that invoke multiple contract
   * calls at once via this abstraction layer. For example, something like
   *
   * ```js
   * let [ a, b ] = [someId1, someId2].map(id => { new Contract(id) });
   *
   * let combinedOp = Operation.invokeHostFunctions({
   *  source: undefined, // optional
   *  functions: [
   *    a.partialCall("hello"),
   *    a.partialCall("transfer", ...),
   *    b.partialCall("increment"),
   *  ]
   * });
   * ```
   *
   * @param {string} method - name of the method to call
   * @param {...xdr.ScVal} params - arguments to pass to the function call
   * @returns {xdr.Operation} Build a InvokeHostFunctionOp operation to call the
   * contract.
   */
//   call(method, ...params) {
//     const contractId = Buffer.from(this._id, 'hex');

//     return Operation.invokeHostFunction({
//       args: xdr.HostFunctionArgs.hostFunctionTypeInvokeContract([
//         xdr.ScVal.scvBytes(contractId),
//         xdr.ScVal.scvSymbol(method),
//         ...params
//       ]),
//       auth: []
//     });
//   }

  /**
   * Returns the read-only footprint entry necessary for any invocations to this
   * contract, for convenience when adding it to your transaction's overall
   * footprint.
   *
   * @returns {xdr.LedgerKey} the contract's executable data ledger key
   */
  getFootprint() {
    const contractId = Buffer.from(this._id, 'hex')

    return xdr.LedgerKey.contractData(
      new xdr.LedgerKeyContractData({
        contractId,
        key: xdr.ScVal.scvLedgerKeyContractExecutable(),
      })
    )
  }
}
