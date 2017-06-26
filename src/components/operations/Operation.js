import React from 'react'
import {Row} from 'react-bootstrap'
import PropTypes from 'prop-types'

import AccountLink from '../shared/AccountLink'

import AccountMerge from './AccountMerge'
import AllowTrust from './AllowTrust'
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

const SubOperation = ({op}) => {
  const SubOpComponent = opTypeComponentMap[op.type]
  return <SubOpComponent {...op} />
}

const Operation = ({compact, op, opURLFn}) =>
  <Row key={op.id} className="operation">
    {op.type !== 'account_merge'
      ? <AccountLink account={op.sourceAccount} />
      : <span title={op.sourceAccount}>
          {op.sourceAccount.substring(0, 4)}
        </span>}:&nbsp;
    <SubOperation op={op} />
    <a href={opURLFn(op.id)}>
      <span
        style={{
          fontSize: '0.8em',
          backgroundColor: 'white',
          borderRadius: '3',
          color: 'black',
          padding: 2,
          marginLeft: 10,
        }}
      >
        JSON
      </span>
    </a>
  </Row>

Operation.defaultProps = {
  compact: true,
}

Operation.propTypes = {
  compact: PropTypes.bool,
  op: PropTypes.object.isRequired,
  opURLFn: PropTypes.func.isRequired,
}

export default Operation
