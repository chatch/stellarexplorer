import React from 'react'
import propTypes from 'prop-types'

import AccountMerge from './operations/AccountMerge'
import AllowTrust from './operations/AllowTrust'
import ChangeTrust from './operations/ChangeTrust'
import CreateAccount from './operations/CreateAccount'
import Inflation from './operations/Inflation'
import ManageData from './operations/ManageData'
import Offer from './operations/Offer'
import PathPayment from './operations/PathPayment'
import Payment from './operations/Payment'
import SetOptions from './operations/SetOptions'

import AccountLink from './shared/AccountLink'
import Asset from './shared/Asset'
import JSONButton from './shared/JSONButton'
import TimeSynchronisedFormattedRelative from './shared/TimeSynchronizedFormattedRelative'
import TransactionHash from './shared/TransactionHash'

// operations
// account_merge: AccountMerge,
// allow_trust: AllowTrust,
// change_trust: ChangeTrust,
// create_account: CreateAccount,
// create_passive_offer: Offer,
// inflation: Inflation,
// manage_data: ManageData,
// manage_offer: Offer,
// path_payment: PathPayment,
// payment: Payment,
// set_options: SetOptions,

const Amount = ({amount, assetType, assetCode, assetIssuer}) => (
  <span>
    {amount} <Asset code={assetCode} type={assetType} issuer={assetIssuer} />
  </span>
)

const effectTypeComponentMap = {
  account_created: Amount,
  account_removed: Amount,
  account_credited: Amount,
  account_debited: Amount,
  // account_thresholds_updated: Something,
  // account_home_domain_updated: Something,
  // account_flags_updated: Something,
  // signer_created: Something,
  // signer_removed: Something,
  // signer_updated: Something,
  // trustline_created: Something,
  // trustline_removed: Something,
  // trustline_updated: Something,
  // trustline_authorized: Something,
  // trustline_deauthorized: Something,
  offer_created: Offer,
  offer_removed: Offer,
  offer_updated: Offer,
  // trade: Something,
  // data_created: Something,
  // data_removed: Something,
  // data_updated: Something,
}

const EffectDetails = ({effect}) => {
  const SubEffectComponent = effectTypeComponentMap[effect.type]
  if (!SubEffectComponent) return <span>{effect.type}</span>
  return <SubEffectComponent {...effect} />
}

class Effect extends React.Component {
  state = {tx: null}

  componentDidMount() {
    this.props.effect
      .operation()
      .then(eff => eff.transaction())
      .then(tx => this.setState({tx: tx}))
  }

  render() {
    const {effect, effectURLFn, showAccount = true} = this.props

    const opLink = effect.links.operation.href
    const opId = opLink.substring(opLink.lastIndexOf('/') + 1)

    return (
      <tr key={effect.id} id={effect.id} className="effect">
        {showAccount && (
          <td className="account-badge">
            <AccountLink account={effect.account} />
          </td>
        )}
        <td>{effect.type}</td>
        <td>
          <EffectDetails effect={effect} />
        </td>
        <td>
          {this.state.tx != null && (
            <TransactionHash hash={this.state.tx.hash} compact={true} />
          )}
        </td>
        <td>
          {this.state.tx != null && (
            <TimeSynchronisedFormattedRelative
              initialNow={this.props.parentRenderTimestamp}
              value={this.state.tx.created_at}
            />
          )}
        </td>
        <td>
          <JSONButton url={effectURLFn(opId)} />
        </td>
      </tr>
    )
  }
}

Effect.propTypes = {
  effect: propTypes.shape({
    id: propTypes.string.isRequired,
    links: propTypes.object.isRequired,
    account: propTypes.string.isRequired,
    type: propTypes.string.isRequired,
  }).isRequired,
  effectURLFn: propTypes.func.isRequired,
  parentRenderTimestamp: propTypes.number,
}

export default Effect
