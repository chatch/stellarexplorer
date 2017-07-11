import React from 'react'
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
import PropTypes from 'prop-types'

import AccountLink from '../shared/AccountLink'
import HorizonJSONButton from '../shared/HorizonJSONButton'
import TransactionTime from '../shared/TransactionTime'

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

const opTypes = Object.keys(opTypeComponentMap)

const SubOperation = ({op}) => {
  const SubOpComponent = opTypeComponentMap[op.type]
  return <SubOpComponent {...op} />
}

const txLinkToHash = link => {
  const uri = 'transactions/'
  return link.substring(link.indexOf(uri) + uri.length)
}

const Operation = ({compact, op, opURLFn}) => {
  const acc =
    op.type !== 'account_merge'
      ? <AccountLink account={op.sourceAccount} />
      : <span title={op.sourceAccount}>
          {op.sourceAccount.substring(0, 4)}
        </span>
  return (
    <Row key={op.id} className="operation">
      <Col md={1}>
        {acc}
      </Col>
      <Col md={7}>
        <SubOperation op={op} />
      </Col>
      <Col md={3}>
        <TransactionTime id={txLinkToHash(op.links.transaction.href)} />
      </Col>
      <Col md={1}>
        <HorizonJSONButton id={op.id} urlFn={opURLFn} />
      </Col>
    </Row>
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
  }).isRequired,
  opURLFn: PropTypes.func.isRequired,
}

export default Operation
