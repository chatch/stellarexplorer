import { shortAddress } from '../../lib/utils'

import AccountLink from '../shared/AccountLink'
import JSONButton from '../shared/JSONButton'
import OperationType from '../shared/OperationType'
import RelativeTime from '../shared/RelativeTime'
import TransactionHash from '../shared/TransactionHash'

import AccountMerge from './AccountMerge'
import type { AllowTrustProps } from './AllowTrust'
import AllowTrust from './AllowTrust'
import BumpSequence from './BumpSequence'
import ChangeTrust from './ChangeTrust'
import {
  ClaimClaimableBalanceOperation,
  CreateClaimableBalanceOperation,
} from './ClaimableBalances'
import {
  ClawbackOperation,
  ClawbackClaimableBalanceOperation,
} from './Clawback'
import type { CreateAccountProps } from './CreateAccount'
import CreateAccount from './CreateAccount'
import { BumpFootprintExpiration, RestoreFootprint } from './Footprint'
import Inflation from './Inflation'
import InvokeHostFunction from './InvokeHostFunction'
import { LiquidityPoolDeposit, LiquidityPoolWithdraw } from './LiquidityPool'
import type { ManageDataProps } from './ManageData'
import ManageData from './ManageData'
import Offer from './Offer'
import type { PathPaymentProps } from './PathPayment'
import PathPayment from './PathPayment'
import Payment from './Payment'
import type { SetOptionsProps } from './SetOptions'
import SetOptions from './SetOptions'
import SetTrustLineFlags from './SetTrustLineFlags'
import {
  BeginSponsoringFutureReserves,
  EndSponsoringFutureReserves,
} from './Sponsorship'
import Unrecognized from './Unrecognized'

const OperationTypeToComponentMap = {
  account_merge: AccountMerge,
  allow_trust: AllowTrust,
  begin_sponsoring_future_reserves: BeginSponsoringFutureReserves,
  bump_sequence: BumpSequence,
  bump_footprint_expiration: BumpFootprintExpiration,
  change_trust: ChangeTrust,

  clawback: ClawbackOperation,
  clawback_claimable_balance: ClawbackClaimableBalanceOperation,

  create_account: CreateAccount,
  create_passive_sell_offer: Offer,
  create_passive_offer: Offer, // < Protocol 11

  claim_claimable_balance: ClaimClaimableBalanceOperation,
  create_claimable_balance: CreateClaimableBalanceOperation,

  end_sponsoring_future_reserves: EndSponsoringFutureReserves,
  inflation: Inflation,

  liquidity_pool_deposit: LiquidityPoolDeposit,
  liquidity_pool_withdraw: LiquidityPoolWithdraw,

  invoke_host_function: InvokeHostFunction,

  manage_data: ManageData,
  manage_buy_offer: Offer,
  manage_sell_offer: Offer,
  manage_offer: Offer, // < Protocol 11

  path_payment_strict_send: PathPayment,
  path_payment_strict_receive: PathPayment,
  path_payment: PathPayment, // < Protocol 12

  payment: Payment,
  restore_footprint: RestoreFootprint,
  set_options: SetOptions,
  set_trust_line_flags: SetTrustLineFlags,
}

type OperationTypes = keyof typeof OperationTypeToComponentMap

interface OperationRecordProps
  extends AllowTrustProps,
    CreateAccountProps,
    ManageDataProps,
    PathPaymentProps,
    SetOptionsProps {
  id: string
  type: OperationTypes
  limit: number
  sourceAccount: string
  sourceAccountMuxed?: string
  from?: string
  fromMuxed?: string
  transactionHash?: string
  time: string
  into: string
  bumpTo: number
  hostFunctions: any
}

interface OperationProps {
  compact: boolean
  op: OperationRecordProps
  horizonURL?: string
}

const SubOperation = ({ op }: { op: OperationRecordProps }) => {
  const SubOpComponent = OperationTypeToComponentMap[op.type] || Unrecognized
  return <SubOpComponent {...op} />
}

const Operation = ({ compact, op, horizonURL }: OperationProps) => {
  let opAccount

  if (op.fromMuxed) {
    opAccount = op.fromMuxed
  } else if (op.from) {
    opAccount = op.from
  } else if (op.sourceAccountMuxed) {
    opAccount = op.sourceAccountMuxed
  } else {
    opAccount = op.sourceAccount
  }

  const acc =
    op.type !== 'account_merge' ? (
      <AccountLink account={opAccount} />
    ) : (
      <span title={opAccount}>{shortAddress(opAccount)}</span>
    )

  return (
    <tr key={op.id} className="operation">
      <td className="account-badge">{acc}</td>
      <td>
        <SubOperation op={op} />
      </td>
      {compact === false && op.transactionHash && (
        <td>
          <TransactionHash hash={op.transactionHash} compact={true} />
        </td>
      )}
      {compact === false && (
        <td>
          <OperationType type={op.type} compact={false} />
        </td>
      )}
      <td>
        <span title={op.time}>
          <RelativeTime timeStr={op.time} />
        </span>
      </td>
      <td>
        <JSONButton
          url={`${horizonURL}operations/${op.id}`}
          filterFn={undefined}
        />
      </td>
    </tr>
  )
}

const operationTypesKeys = Object.keys(OperationTypeToComponentMap)

export { Operation as default, operationTypesKeys }
