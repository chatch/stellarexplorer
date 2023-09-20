import AccountLink from '../shared/AccountLink'
import Asset from '../shared/Asset'

const ClawbackOperation = ({
  assetCode,
  assetIssuer,
  assetType,
  from,
  amount
}: {
  amount: string
  assetCode: string,
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

export default ClawbackOperation
