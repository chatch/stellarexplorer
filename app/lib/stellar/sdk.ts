import { Horizon } from 'stellar-sdk'
import { AccountCallBuilder } from 'stellar-sdk/lib/horizon/account_call_builder'
import { AssetsCallBuilder } from 'stellar-sdk/lib/horizon/assets_call_builder'
import { EffectCallBuilder } from 'stellar-sdk/lib/horizon/effect_call_builder'
import { LedgerCallBuilder } from 'stellar-sdk/lib/horizon/ledger_call_builder'
import { OfferCallBuilder } from 'stellar-sdk/lib/horizon/offer_call_builder'
import { OperationCallBuilder } from 'stellar-sdk/lib/horizon/operation_call_builder'
import { PaymentCallBuilder } from 'stellar-sdk/lib/horizon/payment_call_builder'
import { TradesCallBuilder } from 'stellar-sdk/lib/horizon/trades_call_builder'
import { TransactionCallBuilder } from 'stellar-sdk/lib/horizon/transaction_call_builder'
import URI from 'urijs'

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
const wrapStellarCallBuilderWithWebPagePaging = (CallBuilder: any) => {
  return class WrappedCallBuilder extends CallBuilder {
    wrapNext = (rspNext: () => Promise<any>) => () => {
      return rspNext().then((rsp: any) => {
        return this.wrap(rsp)
      })
    }

    wrapPrev = (rspPrev: () => Promise<any>) => () => {
      return rspPrev().then((rsp: { records?: any; next: any; prev: any }) => {
        // prev requests desc so flip it to the order we maintain for every page
        rsp.records = rsp.records.reverse()

        // prev response sets the next prev to the previous page loaded as opposed to
        // the previous page in the full ordered result set. we want the latter so we
        // slip prev and next here.
        const { prev, next } = rsp
        rsp.next = prev
        rsp.prev = next

        return this.wrap(rsp)
      })
    }

    wrap(stellarRsp: { next: () => any; prev: () => any }) {
      stellarRsp.next = this.wrapNext(stellarRsp.next)
      stellarRsp.prev = this.wrapPrev(stellarRsp.prev)
      return stellarRsp
    }

    /**
     * Calls the parent call() and modifies the response.
     */
    call() {
      return super.call().then((stellarRsp: any) => {
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
  (callName) =>
    ((Horizon.Server.prototype as any)[callName] = function (...params: any) {
      const WrappedClass = wrapStellarCallBuilderWithWebPagePaging(
        (pagingCalls as any)[callName],
      )
      return new (WrappedClass as any)(URI(this.serverURL), ...params)
    }),
)

export { MemoHash, MemoReturn, MuxedAccount, StrKey } from 'stellar-sdk'
