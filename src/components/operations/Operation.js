import React from 'react'
import {Row} from 'react-bootstrap'
import PropTypes from 'prop-types'
import _ from 'lodash'

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

const opTypeToComponent = {
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
  const SubOpComponent = opTypeToComponent[op.type]
  return <SubOpComponent {...op} />
}

const Operation = props => {
  const op = _.mapKeys(props.op, (v, k) => _.camelCase(k))
  return (
    <Row key={op.id} className="operation">
      {op.type !== 'account_merge'
        ? <AccountLink account={op.sourceAccount} />
        : op.sourceAccount}:&nbsp;
      <SubOperation op={op} />
    </Row>
  )
}

PropTypes.Operation = {
  op: PropTypes.object.isRequired,
}

export default Operation
