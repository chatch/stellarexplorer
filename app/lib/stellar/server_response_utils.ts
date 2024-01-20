import mapKeys from 'lodash/mapKeys'
import camelCase from 'lodash/camelCase'
import has from 'lodash/has'
import type { ServerApi } from 'stellar-sdk'

import type { TransactionProps } from '~/routes/tx.$txHash'
import type { LedgerProps } from '~/routes/ledger.$ledgerId'

/**
 * Convert horizon generic response into format used by the React components.
 * @param rsp Horizon response record
 * @param rspRecordConverterFn Converter use on each child record
 * @returns Converted response
 */
const serverApiResponseToState = (
  rsp: ServerApi.CollectionPage<
    | ServerApi.EffectRecord
    | ServerApi.LedgerRecord
    | ServerApi.OperationRecord
    | ServerApi.OfferRecord
    | ServerApi.PaymentOperationRecord
    | ServerApi.TradeRecord
    | ServerApi.TransactionRecord
    | ServerApi.LiquidityPoolRecord
    | ServerApi.ClaimableBalanceRecord
  >,
  rspRecordConverterFn: any,
) => rsp.records.map(rspRecordConverterFn)

/*
 * Converters for the various entity types to change to a format used by the
 * React components.
 */

const ledgerRspRecToPropsRec = (
  rspRec: ServerApi.LedgerRecord,
): LedgerProps => {
  // NOTE: as at 11 March 2018 testnet horizon returns base values in stroops
  //        but mainnet returns in lumens. so handling both until all are moved
  //        to stroops.
  const baseFeeInStroops = has(rspRec, 'base_fee_in_stroops')
  return {
    id: rspRec.id,
    sequence: rspRec.sequence,
    time: rspRec.closed_at,
    hash: rspRec.hash,
    protocolVersion: rspRec.protocol_version,
    maxTxSetSize: rspRec.max_tx_set_size,

    transactionCount: rspRec.transaction_count,
    successfulTransactionCount: rspRec.successful_transaction_count,
    failedTransactionCount: rspRec.failed_transaction_count,
    operationCount: rspRec.operation_count,

    totalCoins: rspRec.total_coins, // maybe display these on the front page ...?
    feePool: rspRec.fee_pool,
    baseFeeInStroops,
    baseFee: baseFeeInStroops ? rspRec.base_fee_in_stroops : rspRec.base_fee,
    baseReserve: baseFeeInStroops
      ? rspRec.base_reserve_in_stroops
      : Number(rspRec.base_reserve),

    pagingToken: rspRec.paging_token,
    prevHash: rspRec.prev_hash,
    prevSeq: Number(rspRec.sequence) - 1, // horizon doesn't support ledger lookup by hash - so derive seq - does this break?
  }
}

const transactionRspRecToPropsRec = (
  rspRec: ServerApi.TransactionRecord,
): TransactionProps => ({
  id: rspRec.id,
  hash: rspRec.hash,
  ledger: rspRec.ledger_attr,
  opCount: rspRec.operation_count,
  sourceAccount: rspRec.source_account,
  time: rspRec.created_at,
  fee: rspRec.fee_charged,
  memoType: rspRec.memo_type,
  memo: rspRec.memo,
  pagingToken: rspRec.paging_token,
})

const operationRspRecToPropsRec = (
  rspRec: ServerApi.OperationRecord & { pagingToken: string },
): Record<string, any> => keysToCamelCasePlusTime(rspRec)

const effectRspRecToPropsRec = (rspRec: ServerApi.EffectRecord) =>
  keysToCamelCase(rspRec)

const paymentRspRecToPropsRec = (
  rspRec: ServerApi.PaymentOperationRecord,
): Record<string, any> => keysToCamelCasePlusTime(rspRec)

const offersRspRecToPropsRec = (
  rspRec:
    | ServerApi.PassiveOfferOperationRecord
    | ServerApi.ManageOfferOperationRecord,
): Record<string, any> => keysToCamelCasePlusTime(rspRec)

const tradeRspRecToPropsRec = (
  rspRec: ServerApi.TradeRecord,
): Record<string, any> => keysToCamelCasePlusTime(rspRec, 'ledger_close_time')

const liquidityPoolRspRecToPropsRec = (
  rspRec: ServerApi.LiquidityPoolRecord,
): Record<string, any> => keysToCamelCasePlusTime(rspRec)

const claimableBalanceRspRecToPropsRec = (
  rspRec: ServerApi.ClaimableBalanceRecord,
): Record<string, any> => keysToCamelCasePlusTime(rspRec)

/*
 * Helpers
 */

const keysToCamelCase = (rec: Record<string, any>) =>
  mapKeys(rec, (v, k) => camelCase(k))

const keysToCamelCasePlusTime = (
  rec: Record<string, any>,
  timePropKey = 'created_at',
): Record<string, any> & { time: string } => ({
  time: rec[timePropKey],
  ...keysToCamelCase(rec),
})

export {
  serverApiResponseToState,
  effectRspRecToPropsRec,
  ledgerRspRecToPropsRec,
  offersRspRecToPropsRec,
  operationRspRecToPropsRec,
  paymentRspRecToPropsRec,
  tradeRspRecToPropsRec,
  transactionRspRecToPropsRec,
  liquidityPoolRspRecToPropsRec,
  claimableBalanceRspRecToPropsRec,
}
