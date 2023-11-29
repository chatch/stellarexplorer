import type { LedgerCallBuilder } from 'stellar-sdk/lib/ledger_call_builder'
import type HorizonServer from './server'
import {
  effectRspRecToPropsRec,
  ledgerRspRecToPropsRec,
  offersRspRecToPropsRec,
  operationRspRecToPropsRec,
  paymentRspRecToPropsRec,
  serverApiResponseToState,
  tradeRspRecToPropsRec,
  transactionRspRecToPropsRec,
} from './server_response_utils'
import {
  FederationServer,
  MuxedAccount,
  NotFoundError,
  type ServerApi,
} from 'stellar-sdk'
import type { CallBuilder } from 'stellar-sdk/lib/call_builder'
import type { OperationCallBuilder } from 'stellar-sdk/lib/operation_call_builder'
import type { EffectCallBuilder } from 'stellar-sdk/lib/effect_call_builder'
import type { PaymentCallBuilder } from 'stellar-sdk/lib/payment_call_builder'
import type { TradesCallBuilder } from 'stellar-sdk/lib/trades_call_builder'
import { isPublicKey, isFederatedAddress, isMuxedAddress } from './utils'
import type { AccountCallBuilder } from 'stellar-sdk/lib/account_call_builder'
import type { TransactionCallBuilder } from 'stellar-sdk/lib/transaction_call_builder'
import type { OfferCallBuilder } from 'stellar-sdk/lib/offer_call_builder'
import AccountTypeUnrecognizedException from '../error/AccountTypeUnrecognizedException'

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
  const builder: CallBuilder<ServerApi.LedgerRecord> = server
    .ledgers()
    .ledger(ledgerSeq)
  return builder.call().then(ledgerRspRecToPropsRec)
}

const transactions = (
  server: HorizonServer,
  {
    ledgerSeq,
    accountId,
    cursor,
    order = 'desc',
    limit = 5,
  }: PageOptions & { ledgerSeq?: string; accountId?: string },
) => {
  const builder: TransactionCallBuilder = server.transactions()
  if (ledgerSeq) {
    builder.forLedger(ledgerSeq)
  }
  if (accountId) {
    builder.forAccount(accountId)
  }
  if (cursor) {
    builder.cursor(cursor)
  }
  builder.limit(limit)
  builder.order(order)
  return builder
    .call()
    .then((serverRsp) =>
      serverApiResponseToState(serverRsp, transactionRspRecToPropsRec),
    )
}

const transaction = (server: HorizonServer, txHash: string) => {
  const callBuilder: CallBuilder<ServerApi.TransactionRecord> = server
    .transactions()
    .transaction(txHash)
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
    cursor,
    order = 'desc',
    limit = 5,
  }: PageOptions & { accountId?: string; tx?: string },
) => {
  const builder: OperationCallBuilder = server.operations()

  if (tx) builder.forTransaction(tx)
  if (accountId) builder.forAccount(accountId)

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
    cursor,
    order = 'desc',
    limit = 5,
  }: PageOptions & { accountId?: string; tx?: string; operationId?: string },
): Promise<ReadonlyArray<ServerApi.EffectRecord>> => {
  const builder: EffectCallBuilder = server.effects()

  if (accountId) builder.forAccount(accountId)
  if (operationId) builder.forOperation(operationId)
  if (tx) builder.forTransaction(tx)

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
    cursor,
    order = 'desc',
    limit = 5,
  }: PageOptions & { accountId?: string },
) => {
  const builder: TradesCallBuilder = server.trades()
  if (accountId) builder.forAccount(accountId)

  if (cursor) builder.cursor(cursor)
  builder.limit(limit)
  builder.order(order)

  return builder
    .call()
    .then((serverRsp) =>
      serverApiResponseToState(serverRsp, tradeRspRecToPropsRec),
    )
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
}
