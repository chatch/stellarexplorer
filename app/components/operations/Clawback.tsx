import AccountLink from '../shared/AccountLink'
import Asset from '../shared/Asset'
import truncate from 'lodash/truncate'

const ClawbackOperation = ({
  assetCode,
  assetIssuer,
  assetType,
  from,
  amount,
}: {
  amount: string
  assetCode: string
  assetIssuer: string
  assetType: string
  from: string
}) => (
  <span>
    Clawback {amount}&nbsp;
    <Asset code={assetCode} issuer={assetIssuer} type={assetType} />
    &nbsp;from&nbsp;
    <AccountLink account={from} />
  </span>
)

const ClawbackClaimableBalanceOperation = ({
  balanceId,
}: {
  balanceId: string
}) => (
  <span>
    Clawback balance id:{' '}
    <span title={balanceId}>{truncate(balanceId, { length: 40 })}</span>
  </span>
)

export { ClawbackOperation, ClawbackClaimableBalanceOperation }
