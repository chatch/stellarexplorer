import * as Sentry from '@sentry/remix'
import type { ServerApi } from 'stellar-sdk/lib/horizon'

import { FormattedMessage } from 'react-intl'
import truncate from 'lodash/truncate'

import Offer from './operations/Offer'
import AccountLink from './shared/AccountLink'
import Asset from './shared/Asset'
import FormattedAmount from './shared/FormattedAmount'
import JSONButton from './shared/JSONButton'
import RelativeTime from './shared/RelativeTime'
import TransactionHash from './shared/TransactionHash'

import { base64Decode } from '../lib/utils'
import {
  LiquidityPoolDeposit,
  LiquidityPoolWithdraw,
} from './operations/LiquidityPool'

export type EffectProps = ServerApi.EffectRecord & {
  op?: ServerApi.OperationRecord
}

const AccountCreated = ({ account, startingBalance }: any) => (
  <span>
    <FormattedMessage id="account" />
    {': '}
    <AccountLink account={account} />
    {'; '}
    <FormattedMessage id="balance" />
    {': '}
    <FormattedAmount amount={startingBalance} />
  </span>
)

const AccountFlagsUpdated = ({
  authRequiredFlag = null,
  authRevocableFlag = null,
}) => (
  <span>
    <FormattedMessage id="flags" />
    {': '}
    {authRequiredFlag != null && (
      <span>auth_required_flag={String(authRequiredFlag)}; </span>
    )}
    {authRevocableFlag != null && (
      <span>auth_revocable_flag={String(authRevocableFlag)}</span>
    )}
  </span>
)

const AccountHomeDomainUpdated = ({ homeDomain }: any) => (
  <span>
    <FormattedMessage id="home.domain" />
    {': '}
    <a href={`https://${homeDomain}`} target="_blank" rel="noreferrer">
      {homeDomain}
    </a>
  </span>
)

const AccountRemoved = ({ account }: any) => (
  <span>
    <FormattedMessage id="account" />
    {': '}
    {account}
  </span>
)

const Amount = ({
  amount,
  assetType,
  assetCode,
  assetIssuer,
  showLabel = true,
}: any) => (
  <span>
    {showLabel === true && (
      <span>
        <FormattedMessage id="amount" />
        {': '}
      </span>
    )}
    <FormattedAmount amount={amount} />{' '}
    <Asset code={assetCode} type={assetType} issuer={assetIssuer} />
  </span>
)

const AssetWrap = ({ assetType, assetCode, assetIssuer }: any) => (
  <Asset code={assetCode} type={assetType} issuer={assetIssuer} />
)

const ContractDebitCredit = ({
  amount,
  assetType,
  assetCode,
  assetIssuer,
  contract,
}: any) => (
  <span>
    <FormattedMessage id="contract" />
    {': '}
    <AccountLink account={contract} />
    {'; '}
    <Amount
      amount={amount}
      assetCode={assetCode}
      assetType={assetType}
      assetIssuer={assetIssuer}
      showLabel={false}
    />
  </span>
)

const Data = ({ op, type }: any) => {
  if (!op) return null
  return (
    <div>
      <div>
        <FormattedMessage id="key" />
        {': '}
        <span title={op.name}>{truncate(op.name)}</span>
      </div>

      {/* logging and workaround for issue seen on testnet where the value was undefined and it crashed */}
      {op.value === undefined &&
        Sentry.captureMessage(
          `op.value undefined for op ${JSON.stringify(op)}`,
        )}

      {type !== 'data_removed' && op.value && (
        <div>
          <FormattedMessage id="value" />
          {': '}
          <span title={op.value}>{truncate(base64Decode(op.value))}</span>
        </div>
      )}
    </div>
  )
}

const SequenceBumped = ({ newSeq }: any) => <span>{newSeq}</span>

const Signer = ({ publicKey, weight }: any) => (
  <span>
    <FormattedMessage id="key.public" />
    {': '}
    <AccountLink account={publicKey} />
    {'; '} <FormattedMessage id="weight" />
    {': '}
    {weight}
  </span>
)

const Trade = ({
  boughtAmount,
  boughtAssetType,
  boughtAssetCode,
  boughtAssetIssuer,
  seller,
  soldAmount,
  soldAssetType,
  soldAssetCode,
  soldAssetIssuer,
}: any) => (
  <span>
    <FormattedMessage id="bought" />
    {': '}
    <Amount
      amount={boughtAmount}
      assetCode={boughtAssetCode}
      assetType={boughtAssetType}
      assetIssuer={boughtAssetIssuer}
      showLabel={false}
    />
    {'; '}
    <FormattedMessage id="sold" />
    {': '}
    <Amount
      amount={soldAmount}
      assetCode={soldAssetCode}
      assetType={soldAssetType}
      assetIssuer={soldAssetIssuer}
      showLabel={false}
    />
    {'; '}
    <FormattedMessage id="seller" />
    {': '}
    <AccountLink account={seller} />
  </span>
)

const Trustline = ({
  assetType,
  assetCode,
  assetIssuer,
  limit,
  trustor,
}: any) => (
  <span>
    <FormattedMessage id="asset" />
    {': '}
    <Asset code={assetCode} type={assetType} issuer={assetIssuer ?? trustor} />
    {limit && (
      <span>
        {'; '}
        <FormattedMessage id="limit" />
        {': '}
        {limit}
      </span>
    )}
  </span>
)

const TrustlineFlagsUpdated = ({
  assetType,
  assetCode,
  assetIssuer,
  authorizedFlag,
  trustor,
}: any) => (
  <span>
    <FormattedMessage id="asset" />
    {': '}
    <Asset code={assetCode} type={assetType} issuer={assetIssuer ?? trustor} />

    {authorizedFlag !== undefined && (
      <span>;&nbsp;authorizedFlag={authorizedFlag ? 'true' : 'false'}</span>
    )}

    {trustor && (
      <span>
        ;&nbsp;trustor=
        <AccountLink account={trustor} />
      </span>
    )}
  </span>
)

const Thresholds = ({ lowThreshold, medThreshold, highThreshold }: any) => (
  <span>
    <FormattedMessage id="threshold.low" />
    {`: ${lowThreshold} / `}
    <FormattedMessage id="threshold.medium" />
    {`: ${medThreshold} / `}
    <FormattedMessage id="threshold.high" />
    {`: ${highThreshold}`}
  </span>
)

const ClaimableBalanceCreated = ({ account, amount, asset }: any) => {
  const [assetCode, assetIssuer] = asset.split(':')
  return (
    <span>
      <AccountLink account={account} /> created balance for {amount}{' '}
      <Asset code={assetCode} issuer={assetIssuer} type="unknown" />
    </span>
  )
}

const ClaimableBalanceClaimed = ({ account, amount, asset }: any) => {
  const [assetCode, assetIssuer] = asset.split(':')
  return (
    <span>
      <AccountLink account={account} /> claimed {amount}{' '}
      <Asset code={assetCode} issuer={assetIssuer} type="unknown" />
    </span>
  )
}

const ClaimableBalanceClaimantCreated = ({ account, amount, asset }: any) => {
  const [assetCode, assetIssuer] = asset.split(':')
  return (
    <span>
      <AccountLink account={account} /> sponsored for {amount}{' '}
      <Asset code={assetCode} issuer={assetIssuer} type="unknown" />
    </span>
  )
}

const ClaimableBalanceSponsorshipCreated = ({ sponsor }: any) => (
  <span>
    <AccountLink account={sponsor} /> created claimable balance sponsorship
  </span>
)

const ClaimableBalanceSponsorshipRemoved = ({
  account,
  formerSponsor,
}: any) => (
  <span>
    <AccountLink account={formerSponsor} /> revoked sponsored balance from{' '}
    <AccountLink account={account} />
  </span>
)

const ClaimableBalanceClawedback = ({ balanceId }: any) => {
  return (
    <span>
      Clawback balance id:{' '}
      <span title={balanceId}>{truncate(balanceId, { length: 40 })}</span>
    </span>
  )
}

const LiquidityPoolTrade = ({ account, bought, sold }: any) => {
  const [boughtCode, boughtIssuer] = bought.asset.split(':')
  const [soldCode, soldIssuer] = sold.asset.split(':')

  return (
    <span>
      <AccountLink account={account} /> bought {bought.amount}&nbsp;
      <Asset code={boughtCode} issuer={boughtIssuer} type="unknown" /> for&nbsp;
      {sold.amount}&nbsp;
      <Asset code={soldCode} issuer={soldIssuer} type="unknown" />
    </span>
  )
}

const effectTypeComponentMap = {
  account_created: AccountCreated,
  account_removed: AccountRemoved,
  account_credited: Amount,
  account_debited: Amount,
  account_thresholds_updated: Thresholds,
  account_home_domain_updated: AccountHomeDomainUpdated,
  account_flags_updated: AccountFlagsUpdated,
  sequence_bumped: SequenceBumped,
  signer_created: Signer,
  signer_removed: Signer,
  signer_updated: Signer,
  trustline_created: Trustline,
  trustline_removed: AssetWrap,
  trustline_updated: Trustline,
  trustline_authorized: Trustline,
  trustline_deauthorized: Trustline,
  trustline_flags_updated: TrustlineFlagsUpdated,

  offer_created: Offer,
  offer_removed: Offer,
  offer_updated: Offer,
  trade: Trade,
  data_created: Data,
  data_removed: Data,
  data_updated: Data,
  contract_credited: ContractDebitCredit,
  contract_debited: ContractDebitCredit,

  claimable_balance_created: ClaimableBalanceCreated,
  claimable_balance_claimed: ClaimableBalanceClaimed,
  claimable_balance_claimant_created: ClaimableBalanceClaimantCreated,
  claimable_balance_clawed_back: ClaimableBalanceClawedback,

  // account_sponsorship_created
  // account_sponsorship_updated
  // account_sponsorship_removed
  // trustline_sponsorship_created
  // trustline_sponsorship_updated
  // trustline_sponsorship_removed
  // data_sponsorship_created
  // data_sponsorship_updated
  // data_sponsorship_removed
  claimable_balance_sponsorship_created: ClaimableBalanceSponsorshipCreated,
  // claimable_balance_sponsorship_updated
  claimable_balance_sponsorship_removed: ClaimableBalanceSponsorshipRemoved,
  // signer_sponsorship_created
  // signer_sponsorship_updated
  // signer_sponsorship_removed

  liquidity_pool_deposited: LiquidityPoolDeposit,
  liquidity_pool_withdrew: LiquidityPoolWithdraw,
  liquidity_pool_trade: LiquidityPoolTrade,

  // - liquidity_pool_created
  // - liquidity_pool_removed
  // - liquidity_pool_revoked
}

type EffectComponentMapKey = keyof typeof effectTypeComponentMap

/**
 * Given list of records from a horizon response, pick out the one for this
 * effect.
 */
const filterEffectsFn = (effectId: string) => (recordsArr: Array<any>) => {
  const result = recordsArr.filter(({ id }) => id === effectId)
  return result.length > 0 ? JSON.stringify(result[0], null, 2) : ''
}

const EffectDetails = ({ effect, op }: any) => {
  const SubEffectComponent =
    effectTypeComponentMap[effect.type as EffectComponentMapKey]
  if (!SubEffectComponent) return <span>{effect.type}</span>
  return <SubEffectComponent {...effect} op={op} />
}

function Effect({
  effect,
  showAccount = true,
}: Readonly<{
  effect: EffectProps
  showAccount: boolean
}>) {
  const opId = effect.op?.id
  const txHash = effect.op?.transaction_hash
  return (
    <tr key={effect.id} id={effect.id} className="effect">
      {showAccount && (
        <td className="account-badge">
          <AccountLink account={effect.account} />
        </td>
      )}
      <td>{effect.type}</td>
      <td>
        <EffectDetails effect={effect} op={effect.op} />
      </td>
      <td>{txHash && <TransactionHash hash={txHash} compact={true} />}</td>
      <td>
        <RelativeTime timeStr={(effect as any).createdAt} />
      </td>
      <td>
        {opId && (
          <JSONButton
            url={`/operations/${opId}/effects?limit=200&order=desc`}
            filterFn={filterEffectsFn(effect.id)}
          />
        )}
      </td>
    </tr>
  )
}

export default Effect
