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
import PathPayment from './PathPayment'
import Payment from './Payment'
import SetOptions from './SetOptions'

const opTypeComponentMap = {
  account_merge: AccountMerge,
  allow_trust: AllowTrust,
  bump_sequence: BumpSequence,
  change_trust: ChangeTrust,
  create_account: CreateAccount,
  create_passive_offer: Offer,
  inflation: Inflation,
  manage_data: ManageData,
  manage_offer: Offer,
  path_payment: PathPayment,
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
