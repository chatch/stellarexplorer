const sdk = require('stellar-sdk')
const URI = require('urijs')

/* ----------------------------------------------------------
 *
 * Stellar networks
 *
 * ---------------------------------------------------------*/

const networks = {
  public: {
    address: 'https://horizon.stellar.org',
    initFunc: usePubnetServer,
  },
  test: {
    address: 'https://horizon-testnet.stellar.org',
    initFunc: useTestnetServer,
  },
  local: {
    address: 'http://localhost:8000',
    initFunc: useLocalServer,
    hide: true, // from UI
  },
}

function usePubnetServer() {
  sdk.Network.usePublicNetwork()
  return newServer(networks.public.address)
}

function useTestnetServer() {
  sdk.Network.useTestNetwork()
  return newServer(networks.test.address)
}

function useLocalServer() {
  return newServer(networks.local.address)
}

function newServer(address) {
  const server = new sdk.Server(address, {allowHttp: true})
  server.accountURL = id => `${server.serverURL}accounts/${id}`
  server.ledgerURL = id => `${server.serverURL}ledgers/${id}`
  server.opURL = id => `${server.serverURL}operations/${id}`
  server.txURL = id => `${server.serverURL}transactions/${id}`
  return server
}

/* ----------------------------------------------------------
 *
 * Customise the paging behaviour on stellar-sdk calls.
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

const TransactionCallBuilder = require('stellar-sdk/lib/transaction_call_builder')
  .TransactionCallBuilder
const LedgerCallBuilder = require('stellar-sdk/lib/ledger_call_builder')
  .LedgerCallBuilder

const pagingCalls = {
  transactions: TransactionCallBuilder,
  ledgers: LedgerCallBuilder,
}

Object.keys(pagingCalls).forEach(
  callName =>
    (sdk.Server.prototype[callName] = function() {
      const WrappedClass = wrapStellarCallBuilderWithWebPagePaging(
        pagingCalls[callName]
      )
      return new WrappedClass(URI(this.serverURL))
    })
)

export {sdk, networks}
