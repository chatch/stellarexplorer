import { Horizon } from '@stellar/stellar-sdk'
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

// Get CallBuilder classes at runtime by extracting them from a temp server instance
const tempServer = new Horizon.Server('https://horizon.stellar.org')
const pagingCalls = {
  ledgers: Object.getPrototypeOf(tempServer.ledgers()).constructor,
  operations: Object.getPrototypeOf(tempServer.operations()).constructor,
  transactions: Object.getPrototypeOf(tempServer.transactions()).constructor,
  payments: Object.getPrototypeOf(tempServer.payments()).constructor,
  effects: Object.getPrototypeOf(tempServer.effects()).constructor,
  offers: Object.getPrototypeOf(tempServer.offers()).constructor,
  assets: Object.getPrototypeOf(tempServer.assets()).constructor,
  trades: Object.getPrototypeOf(tempServer.trades()).constructor,
  accounts: Object.getPrototypeOf(tempServer.accounts()).constructor,
}

Object.keys(pagingCalls).forEach(
  (callName) =>
    ((Horizon.Server.prototype as any)[callName] = function (...params: any) {
      const WrappedClass = wrapStellarCallBuilderWithWebPagePaging(
        (pagingCalls as any)[callName],
      )
      return new (WrappedClass as any)(
        URI(this.serverURL),
        this.httpClient,
        ...params,
      )
    }),
)

export {
  MemoHash,
  MemoReturn,
  MuxedAccount,
  StrKey,
} from '@stellar/stellar-sdk'
