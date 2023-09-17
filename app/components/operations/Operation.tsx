import { shortAddress } from "../../lib/utils"

import AccountLink from "../shared/AccountLink"
import JSONButton from "../shared/JSONButton"
import OperationType from "../shared/OperationType"
import RelativeTime from "../shared/RelativeTime"
import TransactionHash from "../shared/TransactionHash"

import AccountMerge from "./AccountMerge"
import AllowTrust, { AllowTrustProps } from "./AllowTrust"
import BumpSequence from "./BumpSequence"
import ChangeTrust from "./ChangeTrust"
import { CreateClaimableBalanceOperation } from "./ClaimableBalances"
import CreateAccount, { CreateAccountProps } from "./CreateAccount"
import Inflation from "./Inflation"
import InvokeHostFunction from "./InvokeHostFunction"
import ManageData, { ManageDataProps } from "./ManageData"
import Offer from "./Offer"
import PathPayment, { PathPaymentProps } from "./PathPayment"
import Payment from "./Payment"
import SetOptions, { SetOptionsProps } from "./SetOptions"
import Unrecognized from "./Unrecognized"

const OperationTypeToComponentMap = {
  account_merge: AccountMerge,
  allow_trust: AllowTrust,
  bump_sequence: BumpSequence,
  change_trust: ChangeTrust,

  create_account: CreateAccount,
  create_passive_sell_offer: Offer,
  create_passive_offer: Offer, // < Protocol 11

  create_claimable_balance: CreateClaimableBalanceOperation,

  inflation: Inflation,

  invoke_host_function: InvokeHostFunction,

  manage_data: ManageData,
  manage_buy_offer: Offer,
  manage_sell_offer: Offer,
  manage_offer: Offer, // < Protocol 11

  path_payment_strict_send: PathPayment,
  path_payment_strict_receive: PathPayment,
  path_payment: PathPayment, // < Protocol 12

  payment: Payment,
  set_options: SetOptions,
}

type OperationTypes = keyof typeof OperationTypeToComponentMap

interface OperationRecordProps extends
  AllowTrustProps,
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
    op.type !== "account_merge" ? (
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
        <JSONButton url={`${horizonURL}operations/${op.id}`} filterFn={undefined} />
      </td>
    </tr>
  )
}

const operationTypesKeys = Object.keys(OperationTypeToComponentMap)

export { Operation as default, operationTypesKeys }
