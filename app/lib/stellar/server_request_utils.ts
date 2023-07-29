import type { LedgerCallBuilder } from "stellar-sdk/lib/ledger_call_builder"
import type HorizonServer from "./server"
import {
    effectRspRecToPropsRec,
    ledgerRspRecToPropsRec,
    operationRspRecToPropsRec,
    paymentRspRecToPropsRec,
    serverApiResponseToState,
    tradeRspRecToPropsRec,
    transactionRspRecToPropsRec,
} from "./server_response_utils"
import { FederationServer, MuxedAccount, type ServerApi } from "stellar-sdk"
import type { CallBuilder } from "stellar-sdk/lib/call_builder"
import type { OperationCallBuilder } from "stellar-sdk/lib/operation_call_builder"
import type { EffectCallBuilder } from "stellar-sdk/lib/effect_call_builder"
import type { PaymentCallBuilder } from "stellar-sdk/lib/payment_call_builder"
import type { TradesCallBuilder } from "stellar-sdk/lib/trades_call_builder"
import { handleFetchDataFailure } from "../utils"
import { isPublicKey, isFederatedAddress, isMuxedAddress } from "./utils"
import type { AccountCallBuilder } from "stellar-sdk/lib/account_call_builder"

const ledgers = (server: HorizonServer, limit = 5) => {
    const callBuilder: LedgerCallBuilder = server.ledgers()
    callBuilder.limit(limit)
    callBuilder.order('desc')
    return callBuilder.call().then((serverRsp) =>
        serverApiResponseToState(serverRsp, ledgerRspRecToPropsRec)
    ).then(stateProps =>
        stateProps.records
    )
}

const ledger = (server: HorizonServer, ledgerId: string) => {
    const callBuilder: CallBuilder<ServerApi.LedgerRecord> = server.
        ledgers().
        ledger(ledgerId)
    return callBuilder.call().then(ledgerRspRecToPropsRec)
}

const transactions = (server: HorizonServer, limit = 5) => {
    const callBuilder: LedgerCallBuilder = server.transactions()
    callBuilder.limit(limit)
    callBuilder.order('desc')
    return callBuilder.call().then((serverRsp) =>
        serverApiResponseToState(serverRsp, transactionRspRecToPropsRec)
    ).then(stateProps =>
        stateProps.records
    )
}

const transaction = (server: HorizonServer, txHash: string) => {
    const callBuilder: CallBuilder<ServerApi.TransactionRecord> = server.
        transactions().
        transaction(txHash)
    return callBuilder.call().then(transactionRspRecToPropsRec)
}

export interface LoadAccountResult {
    account: ServerApi.AccountRecord,
    federatedAddress?: string,
    muxedAddress?: string
}

const loadAccount = (server: HorizonServer, accountId: string):
    Promise<LoadAccountResult> => {
    if (isPublicKey(accountId)) {
        return loadAccountByKey(server, accountId)
    } else if (isFederatedAddress(accountId)) {
        return loadAccountByFederatedAddress(server, accountId)
    } else if (isMuxedAddress(accountId)) {
        return loadAccountByMuxedAddress(server, accountId)
    }

    const error = new Error(`Unrecognized account type: ${accountId}`)
    handleFetchDataFailure(accountId)(error)
    return Promise.reject(error)
}

const loadAccountByKey = (server: HorizonServer, accountId: string) =>
    loadAccountFromServer(server, accountId)

const loadAccountByFederatedAddress = (server: HorizonServer, address: string) => {
    const [name, domain] = address.split("*")
    return FederationServer.createForDomain(domain)
        .then((fed) => fed.resolveAddress(name))
        .then((acc) => loadAccountFromServer(server, acc.account_id))
        .then((rsp) => ({
            account: rsp.account, federatedAddress: address
        }))
}

const loadAccountByMuxedAddress = (server: HorizonServer, address: string) => {
    const muxedAccount = MuxedAccount.fromAddress(address, "1")
    const publicAddress = muxedAccount.accountId()
    return loadAccountFromServer(server, publicAddress).then((rsp) => ({
        account: rsp.account, muxedAddress: address
    }))
}

const loadAccountFromServer = (
    server: HorizonServer, accountId: string
): Promise<{ account: ServerApi.AccountRecord }> => {
    const builder: AccountCallBuilder = server.accounts()
    return builder.accountId(accountId).call().then(account => ({ account }))
}

const operations = ({
    server,
    accountId,
    tx,
    limit = 5
}: {
    server: HorizonServer,
    accountId?: string,
    tx?: string,
    limit: number
}) => {
    const builder: OperationCallBuilder = server.operations()
    if (tx) builder.forTransaction(tx)
    if (accountId) builder.forAccount(accountId)
    builder.limit(limit)
    builder.order('desc')
    return builder.call().then(
        (serverRsp) =>
            serverApiResponseToState(serverRsp, operationRspRecToPropsRec)
    ).then(stateProps =>
        stateProps.records
    )
}

const effects = (server: HorizonServer, accountId?: string, operationId?: string, tx?: string, limit = 5) => {
    const builder: EffectCallBuilder = server.effects()
    if (accountId) builder.forAccount(accountId)
    if (operationId) builder.forOperation(operationId)
    if (tx) builder.forTransaction(tx)
    builder.limit(limit)
    builder.order('desc')
    return builder.call().then(
        (serverRsp) =>
            serverApiResponseToState(serverRsp, effectRspRecToPropsRec)
    ).then(stateProps =>
        stateProps.records
    )
}

const payments = (server: HorizonServer, accountId?: string, tx?: string, limit = 5) => {
    const builder: PaymentCallBuilder = server.payments()
    if (accountId) builder.forAccount(accountId)
    if (tx) builder.forTransaction(tx)
    builder.limit(limit)
    builder.order('desc')
    return builder.call().then(
        (serverRsp) =>
            serverApiResponseToState(serverRsp, paymentRspRecToPropsRec)
    ).then(stateProps =>
        stateProps.records
    )
}

const trades = (server: HorizonServer, accountId?: string, limit = 5) => {
    const builder: TradesCallBuilder = server.trades()
    if (accountId) builder.forAccount(accountId)
    builder.limit(limit)
    builder.order('desc')
    return builder.call().then(
        (serverRsp) =>
            serverApiResponseToState(serverRsp, tradeRspRecToPropsRec)
    ).then(stateProps =>
        stateProps.records
    )
}

export {
    effects,
    ledgers,
    ledger,
    operations,
    payments,
    trades,
    transactions,
    transaction,
    loadAccount
}