import type { Asset } from 'stellar-sdk'
import type { ServerApi } from 'stellar-sdk/lib/horizon'

import { FederationServer } from 'stellar-sdk/lib/federation/server'
import { MuxedAccount, NotFoundError } from 'stellar-sdk'

import type { LedgerCallBuilder } from 'stellar-sdk/lib/horizon/ledger_call_builder'
import type { OperationCallBuilder } from 'stellar-sdk/lib/horizon/operation_call_builder'
import type { EffectCallBuilder } from 'stellar-sdk/lib/horizon/effect_call_builder'
import type { PaymentCallBuilder } from 'stellar-sdk/lib/horizon/payment_call_builder'
import type { TradesCallBuilder } from 'stellar-sdk/lib/horizon/trades_call_builder'
import type { AccountCallBuilder } from 'stellar-sdk/lib/horizon/account_call_builder'
import type { TransactionCallBuilder } from 'stellar-sdk/lib/horizon/transaction_call_builder'
import type { OfferCallBuilder } from 'stellar-sdk/lib/horizon/offer_call_builder'
import AccountTypeUnrecognizedException from '../error/AccountTypeUnrecognizedException'
import type { LiquidityPoolCallBuilder } from 'stellar-sdk/lib/horizon/liquidity_pool_call_builder'
import type { ClaimableBalanceCallBuilder } from 'stellar-sdk/lib/horizon/claimable_balances_call_builder'

import type HorizonServer from './server'
import {
  claimableBalanceRspRecToPropsRec,
  effectRspRecToPropsRec,
  ledgerRspRecToPropsRec,
  liquidityPoolRspRecToPropsRec,
  offersRspRecToPropsRec,
  operationRspRecToPropsRec,
  paymentRspRecToPropsRec,
  serverApiResponseToState,
  tradeRspRecToPropsRec,
  transactionRspRecToPropsRec,
} from './server_response_utils'
import { isPublicKey, isFederatedAddress, isMuxedAddress } from './utils'

interface PageOptions {
  cursor?: string
  order?: 'asc' | 'desc'
  limit?: number
}

const withRetry = async (run: () => Promise<any>): Promise<any> => {
  //  Dynamic import is used as p-retry is not compatible with cjs (see: remix.config.js)
  const pRetry = await import('p-retry').then(({ default: pRetry }) => pRetry)

  return pRetry(run, {
    onFailedAttempt: (error) => {
      console.log(
        `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
      )
    },
    retries: 1,
    factor: 1,
    minTimeout: 1000,
    maxTimeout: 2000,
  })
}

const ledgers = async (
  server: HorizonServer,
  { limit = 5, cursor, order = 'desc' }: PageOptions,
) => {
  const builder: LedgerCallBuilder = server.ledgers()
  if (cursor) {
    builder.cursor(cursor)
  }
  builder.limit(limit)
  builder.order(order)

  const serverRsp = await withRetry(async () => builder.call())
  return serverApiResponseToState(serverRsp, ledgerRspRecToPropsRec)
}

const ledger = async (server: HorizonServer, ledgerSeq: string) => {
  const builder = server.ledgers().ledger(ledgerSeq)

  const rspRec = await withRetry(async () => builder.call())
  return ledgerRspRecToPropsRec(rspRec)
}

const transactions = async (
  server: HorizonServer,
  {
    ledgerSeq,
    accountId,
    poolId,
    claimableBalanceId,
    cursor,
    order = 'desc',
    limit = 5,
  }: PageOptions & {
    ledgerSeq?: string
    accountId?: string
    poolId?: string
    claimableBalanceId?: string
  },
) => {
  const builder: TransactionCallBuilder = server.transactions()

  if (ledgerSeq) builder.forLedger(ledgerSeq)
  if (accountId) builder.forAccount(accountId)
  if (poolId) builder.forLiquidityPool(poolId)
  if (claimableBalanceId) builder.forClaimableBalance(claimableBalanceId)

  if (cursor) builder.cursor(cursor)
  builder.limit(limit)
  builder.order(order)

  const serverRsp = await withRetry(async () => builder.call())
  return serverApiResponseToState(serverRsp, transactionRspRecToPropsRec)
}

const transaction = async (server: HorizonServer, txHash: string) => {
  const callBuilder = server.transactions().transaction(txHash)

  const rspRec = await withRetry(async () => callBuilder.call())
  return transactionRspRecToPropsRec(rspRec)
}

export interface LoadAccountResult {
  account: ServerApi.AccountRecord
  federatedAddress?: string
  muxedAddress?: string
}

const loadAccount = (
  server: HorizonServer,
  accountId: string,
): Promise<LoadAccountResult> => {
  if (isPublicKey(accountId)) {
    return loadAccountByKey(server, accountId)
  } else if (isFederatedAddress(accountId)) {
    return loadAccountByFederatedAddress(server, accountId)
  } else if (isMuxedAddress(accountId)) {
    return loadAccountByMuxedAddress(server, accountId)
  }
  throw new AccountTypeUnrecognizedException(accountId)
}

const loadAccountByKey = (server: HorizonServer, accountId: string) =>
  loadAccountFromServer(server, accountId)

const loadAccountByFederatedAddress = async (
  server: HorizonServer,
  address: string,
) => {
  const [name, domain] = address.split('*')
  try {
    const fed = await FederationServer.createForDomain(domain)
    const acc = await fed.resolveAddress(name)
    const rsp = await loadAccountFromServer(server, acc.account_id)
    return {
      account: rsp.account,
      federatedAddress: address,
    }
  } catch (e) {
    throw new NotFoundError(e.message, undefined)
  }
}

const loadAccountByMuxedAddress = async (
  server: HorizonServer,
  address: string,
) => {
  const muxedAccount = MuxedAccount.fromAddress(address, '1')
  const publicAddress = muxedAccount.accountId()
  const rsp = await loadAccountFromServer(server, publicAddress)
  return {
    account: rsp.account,
    muxedAddress: address,
  }
}

const loadAccountFromServer = async (
  server: HorizonServer,
  accountId: string,
): Promise<{ account: ServerApi.AccountRecord }> => {
  const builder: AccountCallBuilder = server.accounts()

  const account = await withRetry(async () =>
    builder.accountId(accountId).call(),
  )
  return { account }
}

const operations = async (
  server: HorizonServer,
  {
    accountId,
    tx,
    poolId,
    claimableBalanceId,
    cursor,
    order = 'desc',
    limit = 5,
  }: PageOptions & {
    accountId?: string
    tx?: string
    poolId?: string
    claimableBalanceId?: string
  },
) => {
  const builder: OperationCallBuilder = server.operations()

  if (accountId) builder.forAccount(accountId)
  if (tx) builder.forTransaction(tx)
  if (poolId) builder.forLiquidityPool(poolId)
  if (claimableBalanceId) builder.forClaimableBalance(claimableBalanceId)

  if (cursor) builder.cursor(cursor)
  builder.limit(limit)
  builder.order(order)

  const serverRsp = await withRetry(async () => builder.call())
  return serverApiResponseToState(serverRsp, operationRspRecToPropsRec)
}

const effects = async (
  server: HorizonServer,
  {
    accountId,
    operationId,
    tx,
    poolId,
    cursor,
    order = 'desc',
    limit = 5,
  }: PageOptions & {
    accountId?: string
    operationId?: string
    tx?: string
    poolId?: string
  },
): Promise<ReadonlyArray<ServerApi.EffectRecord>> => {
  const builder: EffectCallBuilder = server.effects()

  if (accountId) builder.forAccount(accountId)
  if (operationId) builder.forOperation(operationId)
  if (tx) builder.forTransaction(tx)
  if (poolId) builder.forLiquidityPool(poolId)

  if (cursor) builder.cursor(cursor)
  builder.limit(limit)
  builder.order(order)

  const serverRsp = await withRetry(async () => builder.call())
  return serverApiResponseToState(
    serverRsp,
    effectRspRecToPropsRec,
  ) as ReadonlyArray<ServerApi.EffectRecord>
}

const payments = async (
  server: HorizonServer,
  {
    accountId,
    tx,
    cursor,
    order = 'desc',
    limit = 5,
  }: PageOptions & { accountId?: string; tx?: string },
) => {
  const builder: PaymentCallBuilder = server.payments()

  if (accountId) builder.forAccount(accountId)
  if (tx) builder.forTransaction(tx)

  if (cursor) builder.cursor(cursor)
  builder.limit(limit)
  builder.order(order)

  const serverRsp = await withRetry(async () => builder.call())
  return serverApiResponseToState(serverRsp, paymentRspRecToPropsRec)
}

const offers = async (
  server: HorizonServer,
  {
    accountId,
    cursor,
    order = 'desc',
    limit = 5,
  }: PageOptions & { accountId?: string },
) => {
  const builder: OfferCallBuilder = server.offers()

  if (accountId) builder.forAccount(accountId)

  if (cursor) builder.cursor(cursor)
  builder.limit(limit)
  builder.order(order)

  const serverRsp = await withRetry(async () => builder.call())
  return serverApiResponseToState(serverRsp, offersRspRecToPropsRec)
}

const trades = async (
  server: HorizonServer,
  {
    accountId,
    poolId,
    cursor,
    order = 'desc',
    limit = 5,
  }: PageOptions & { accountId?: string; poolId?: string },
) => {
  const builder: TradesCallBuilder = server.trades()
  if (accountId) builder.forAccount(accountId)
  if (poolId) builder.forLiquidityPool(poolId)

  if (cursor) builder.cursor(cursor)
  builder.limit(limit)
  builder.order(order)

  const serverRsp = await withRetry(async () => builder.call())
  return serverApiResponseToState(serverRsp, tradeRspRecToPropsRec)
}

const liquidityPools = async (
  server: HorizonServer,
  {
    id,
    accountId,
    assets,
    cursor,
    order = 'asc',
    limit = 5,
  }: PageOptions & { id?: string; accountId?: string; assets?: Asset[] },
) => {
  const builder: LiquidityPoolCallBuilder = server.liquidityPools()

  if (id) builder.liquidityPoolId(id)
  if (accountId) builder.forAccount(accountId)
  if (assets) builder.forAssets(...assets)

  if (cursor) builder.cursor(cursor)
  builder.limit(limit)
  builder.order(order)

  const serverRsp = await withRetry(async () => builder.call())
  return serverApiResponseToState(serverRsp, liquidityPoolRspRecToPropsRec)
}

const liquidityPool = async (server: HorizonServer, poolId: string) => {
  const builder = server.liquidityPools().liquidityPoolId(poolId)

  const rspRec = await withRetry(async () => builder.call())
  return liquidityPoolRspRecToPropsRec(rspRec)
}

const claimableBalances = async (
  server: HorizonServer,
  {
    id,
    sponsor,
    claimant,
    asset,
    cursor,
    order = 'desc',
    limit = 5,
  }: PageOptions & {
    id?: string
    sponsor?: string
    claimant?: string
    asset?: Asset
  },
) => {
  const builder: ClaimableBalanceCallBuilder = server.claimableBalances()

  if (id) builder.claimableBalance(id)
  if (sponsor) builder.sponsor(sponsor)
  if (claimant) builder.claimant(claimant)
  if (asset) builder.asset(asset)

  if (cursor) builder.cursor(cursor)
  builder.limit(limit)
  builder.order(order)

  const serverRsp = await withRetry(async () => builder.call())
  return serverApiResponseToState(serverRsp, claimableBalanceRspRecToPropsRec)
}

const claimableBalance = async (server: HorizonServer, balanceId: string) => {
  const builder = server.claimableBalances().claimableBalance(balanceId)

  const rspRec = await withRetry(async () => builder.call())
  return claimableBalanceRspRecToPropsRec(rspRec)
}

export {
  effects,
  ledgers,
  ledger,
  offers,
  operations,
  payments,
  trades,
  transactions,
  transaction,
  loadAccount,
  liquidityPools,
  liquidityPool,
  claimableBalances,
  claimableBalance,
}
