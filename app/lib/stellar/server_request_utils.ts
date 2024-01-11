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

import type HorizonServer from './server'
import {
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

const ledgers = (
  server: HorizonServer,
  { limit = 5, cursor, order = 'desc' }: PageOptions,
) => {
  const builder: LedgerCallBuilder = server.ledgers()
  if (cursor) {
    builder.cursor(cursor)
  }
  builder.limit(limit)
  builder.order(order)
  return builder
    .call()
    .then((serverRsp) =>
      serverApiResponseToState(serverRsp, ledgerRspRecToPropsRec),
    )
}

const ledger = (server: HorizonServer, ledgerSeq: string) => {
  const builder = server.ledgers().ledger(ledgerSeq)
  return builder.call().then(ledgerRspRecToPropsRec)
}

const transactions = (
  server: HorizonServer,
  {
    ledgerSeq,
    accountId,
    poolId,
    cursor,
    order = 'desc',
    limit = 5,
  }: PageOptions & { ledgerSeq?: string; accountId?: string; poolId?: string },
) => {
  const builder: TransactionCallBuilder = server.transactions()

  if (ledgerSeq) builder.forLedger(ledgerSeq)
  if (accountId) builder.forAccount(accountId)
  if (poolId) builder.forLiquidityPool(poolId)

  if (cursor) builder.cursor(cursor)
  builder.limit(limit)
  builder.order(order)

  return builder
    .call()
    .then((serverRsp) =>
      serverApiResponseToState(serverRsp, transactionRspRecToPropsRec),
    )
}

const transaction = (server: HorizonServer, txHash: string) => {
  const callBuilder = server.transactions().transaction(txHash)
  return callBuilder.call().then(transactionRspRecToPropsRec)
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

const loadAccountByFederatedAddress = (
  server: HorizonServer,
  address: string,
) => {
  const [name, domain] = address.split('*')
  return FederationServer.createForDomain(domain)
    .then((fed) => fed.resolveAddress(name))
    .then((acc) => loadAccountFromServer(server, acc.account_id))
    .then((rsp) => ({
      account: rsp.account,
      federatedAddress: address,
    }))
    .catch((e) => {
      throw new NotFoundError(e.message, undefined)
    })
}

const loadAccountByMuxedAddress = (server: HorizonServer, address: string) => {
  const muxedAccount = MuxedAccount.fromAddress(address, '1')
  const publicAddress = muxedAccount.accountId()
  return loadAccountFromServer(server, publicAddress).then((rsp) => ({
    account: rsp.account,
    muxedAddress: address,
  }))
}

const loadAccountFromServer = (
  server: HorizonServer,
  accountId: string,
): Promise<{ account: ServerApi.AccountRecord }> => {
  const builder: AccountCallBuilder = server.accounts()
  return builder
    .accountId(accountId)
    .call()
    .then((account) => ({ account }))
}

const operations = (
  server: HorizonServer,
  {
    accountId,
    tx,
    poolId,
    cursor,
    order = 'desc',
    limit = 5,
  }: PageOptions & { accountId?: string; tx?: string; poolId?: string },
) => {
  const builder: OperationCallBuilder = server.operations()

  if (accountId) builder.forAccount(accountId)
  if (tx) builder.forTransaction(tx)
  if (poolId) builder.forLiquidityPool(poolId)

  if (cursor) builder.cursor(cursor)
  builder.limit(limit)
  builder.order(order)

  return builder
    .call()
    .then((serverRsp) =>
      serverApiResponseToState(serverRsp, operationRspRecToPropsRec),
    )
}

const effects = (
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

  return builder
    .call()
    .then(
      (serverRsp) =>
        serverApiResponseToState(
          serverRsp,
          effectRspRecToPropsRec,
        ) as ReadonlyArray<ServerApi.EffectRecord>,
    )
}

const payments = (
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

  return builder
    .call()
    .then((serverRsp) =>
      serverApiResponseToState(serverRsp, paymentRspRecToPropsRec),
    )
}

const offers = (
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

  return builder
    .call()
    .then((serverRsp) =>
      serverApiResponseToState(serverRsp, offersRspRecToPropsRec),
    )
}

const trades = (
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

  return builder
    .call()
    .then((serverRsp) =>
      serverApiResponseToState(serverRsp, tradeRspRecToPropsRec),
    )
}

const liquidityPools = (
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

  return builder
    .call()
    .then((serverRsp) =>
      serverApiResponseToState(serverRsp, liquidityPoolRspRecToPropsRec),
    )
}

const liquidityPool = (server: HorizonServer, poolId: string) => {
  const builder = server.liquidityPools().liquidityPoolId(poolId)
  return builder.call().then(liquidityPoolRspRecToPropsRec)
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
}
