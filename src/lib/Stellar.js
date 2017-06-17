const sdk = require('stellar-sdk')
const URI = require("urijs");
const TransactionCallBuilder = require('stellar-sdk/lib/transaction_call_builder').TransactionCallBuilder

const TESTNET = 'https://horizon-testnet.stellar.org'
const PUBNET = 'https://horizon.stellar.org'
// const LOCALNET = 'http://localhost:8000'

const isPubNet = true // TODO: parameterise
const horizonUrl = (isPubNet)
  ? PUBNET
  : TESTNET

const server = new sdk.Server(horizonUrl, {allowHttp: true})
if (!isPubNet)
  sdk.Network.useTestNetwork()

/**
 * Wrap the Stellar transaction call to modify the default paging behaviour for
 * our needs. Make prev and next work like typical paging of an ordered result
 * set.
 *
 * @see [Stellar Paging docs](https://www.stellar.org/developers/horizon/reference/resources/page.html). .
 */
class TransactionCallBuilderWithWebPagePaging extends TransactionCallBuilder {
  wrapNext = (rspNext) => () => {
    return rspNext().then((rsp) => {
      return this.wrap(rsp)
    })
  }

  wrapPrev = (rspPrev) => () => {
    return rspPrev().then((rsp) => {
      // prev requests desc so flip it to the order we maintain for every page
      rsp.records = rsp.records.reverse()

      // prev response sets the next prev to the previous page loaded as opposed to
      // the previous page in the full ordered result set. we want the latter so we
      // slip prev and next here.
      const {prev, next} = rsp
      rsp.next = prev
      rsp.prev = next

      return this.wrap(rsp)
    })
  }

  wrap(stellarRsp) {
    stellarRsp.next = this.wrapNext(stellarRsp.next)
    stellarRsp.prev = this.wrapPrev(stellarRsp.prev)
    return stellarRsp
  }

  /**
   * Calls the parent call() and modifies the response.
   */
  call() {
    return super.call().then((stellarRsp) => {
      return this.wrap(stellarRsp)
    })
  }
}

sdk.Server.prototype.transactions = function() {
  return new TransactionCallBuilderWithWebPagePaging(URI(this.serverURL))
}

export {sdk, server, isPubNet}
