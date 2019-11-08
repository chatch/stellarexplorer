import React from 'react'
import PropTypes from 'prop-types'

import AccountLink from '../shared/AccountLink'
import JSONButton from '../shared/JSONButton'
import TimeSynchronisedFormattedRelative from '../shared/TimeSynchronizedFormattedRelative'
import TransactionHash from '../shared/TransactionHash'
import OperationType from '../shared/OperationType'

import AccountMerge from './AccountMerge'
import AllowTrust from './AllowTrust'
import BumpSequence from './BumpSequence'
import ChangeTrust from './ChangeTrust'
import CreateAccount from './CreateAccount'
import Inflation from './Inflation'
import ManageData from './ManageData'
import Offer from './Offer'
import PathPaymentStrictSend from './PathPaymentStrictSend'
import PathPaymentStrictReceive from './PathPaymentStrictReceive'
import Payment from './Payment'
import SetOptions from './SetOptions'

// TODO: can remove some of the below maps after renames in Horizon v0.25
// see comments in code here: https://github.com/stellar/go/blob/d01f442ec0d3911bd73a0ad70cf593a3fea64dde/protocols/horizon/operations/main.go#L16
const opTypeComponentMap = {
  account_merge: AccountMerge,
  allow_trust: AllowTrust,
  bump_sequence: BumpSequence,
  change_trust: ChangeTrust,
  create_account: CreateAccount,

  create_passive_sell_offer: Offer,
  // NOTE: can be removed in future after rename:
  create_passive_offer: Offer, // < Protocol 11

  inflation: Inflation,
  manage_data: ManageData,

  manage_buy_offer: Offer,
  manage_sell_offer: Offer,
  // NOTE: can be removed in future after rename:
  manage_offer: Offer, // < Protocol 11
  
  path_payment_strict_send: PathPaymentStrictSend,
  path_payment_strict_receive: PathPaymentStrictReceive,
  // NOTE: can be removed in future after rename:
  path_payment: PathPaymentStrictReceive,
  
  payment: Payment,
  set_options: SetOptions,
}

const opTypes = Object.keys(opTypeComponentMap)

const SubOperation = ({op}) => {
  const SubOpComponent = opTypeComponentMap[op.type]
  return <SubOpComponent {...op} />
}

const Operation = ({compact, op, opURLFn, parentRenderTimestamp}) => {
  const acc =
    op.type !== 'account_merge' ? (
      <AccountLink account={op.sourceAccount} />
    ) : (
      <span title={op.sourceAccount}>{op.sourceAccount.substring(0, 4)}</span>
    )

  return (
    <tr key={op.id} className="operation">
      <td className="account-badge">{acc}</td>
      <td>
        <SubOperation op={op} />
      </td>
      {compact === false && (
        <td>
          <TransactionHash hash={op.transactionHash} compact={true} />
        </td>
      )}
      {compact === false && (
        <td>
          <OperationType
            account={op.sourceAccount}
            type={op.type}
            compact={false}
          />
        </td>
      )}
      <td>
        <span title={op.time}>
          <TimeSynchronisedFormattedRelative
            initialNow={parentRenderTimestamp}
            value={op.time}
          />
        </span>
      </td>
      <td>
        <JSONButton url={opURLFn(op.id)} />
      </td>
    </tr>
  )
}

Operation.defaultProps = {
  compact: true,
}

Operation.propTypes = {
  compact: PropTypes.bool,
  op: PropTypes.shape({
    id: PropTypes.string.isRequired,
    links: PropTypes.object.isRequired,
    sourceAccount: PropTypes.string.isRequired,
    type: PropTypes.oneOf(opTypes).isRequired,
    time: PropTypes.string,
  }).isRequired,
  opURLFn: PropTypes.func.isRequired,
  parentRenderTimestamp: PropTypes.number,
}

export {Operation as default, opTypes}
