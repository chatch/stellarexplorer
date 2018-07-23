import sdk from 'stellar-sdk'
import URI from 'urijs'

import {LedgerCallBuilder} from 'stellar-sdk/lib/ledger_call_builder'
import {OperationCallBuilder} from 'stellar-sdk/lib/operation_call_builder'
import {TransactionCallBuilder} from 'stellar-sdk/lib/transaction_call_builder'
import {PaymentCallBuilder} from 'stellar-sdk/lib/payment_call_builder'
import {OfferCallBuilder} from 'stellar-sdk/lib/offer_call_builder'
import {EffectCallBuilder} from 'stellar-sdk/lib/effect_call_builder'
import {AccountCallBuilder} from 'stellar-sdk/lib/account_call_builder'
import {AssetsCallBuilder} from 'stellar-sdk/lib/assets_call_builder'
import {TradesCallBuilder} from 'stellar-sdk/lib/trades_call_builder'


/* ----------------------------------------------------------
 *
 * Wraps the stellar-sdk to customise the paging behaviour.
 *
 * ---------------------------------------------------------*/

/**
 * Wrap the Stellar CallBuilder's to modify the default paging behaviour for
 * our needs. Make response.prev and response.next work like typical paging of
 * an ordered result set.
 *
 * @see [Stellar Paging docs](https://www.stellar.org/developers/horizon/reference/resources/page.html)
 */
const wrapStellarCallBuilderWithWebPagePaging = CallBuilder => {
  return class WrappedCallBuilder extends CallBuilder {
    wrapNext = rspNext => () => {
      return rspNext().then(rsp => {
        return this.wrap(rsp)
      })
    }

    wrapPrev = rspPrev => () => {
      return rspPrev().then(rsp => {
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
      return super.call().then(stellarRsp => {
        return this.wrap(stellarRsp)
      })
    }
  }
}

/*
 * Wrap the stellar server calls we want to use modified paging on
 */

const pagingCalls = {
  ledgers: LedgerCallBuilder,
  operations: OperationCallBuilder,
  transactions: TransactionCallBuilder,
  payments: PaymentCallBuilder,
  effects: EffectCallBuilder,
  offers: OfferCallBuilder,
  assets: AssetsCallBuilder,
  trades: TradesCallBuilder,
  accounts: AccountCallBuilder,
}

Object.keys(pagingCalls).forEach(
  callName =>
    (sdk.Server.prototype[callName] = function(...params) {
      const WrappedClass = wrapStellarCallBuilderWithWebPagePaging(
        pagingCalls[callName]
      )
      return new WrappedClass(URI(this.serverURL), ...params)
    })
)

export default sdk
