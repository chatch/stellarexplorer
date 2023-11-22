import AccountLink from '../shared/AccountLink'
import Asset from '../shared/Asset'

const CreateClaimableBalanceOperation = ({ amount, sponsor, asset }: any) => {
  const [assetCode, assetIssuer] = asset.split(':')
  return (
    <span>
      <AccountLink account={sponsor} /> created claimable balance for {amount}{' '}
      <Asset code={assetCode} issuer={assetIssuer} type="unknown" />
    </span>
  )
}

const ClaimClaimableBalanceOperation = ({ claimant }: any) => {
  return (
    <span>
      Claimant <AccountLink account={claimant} />
    </span>
  )
}

export { ClaimClaimableBalanceOperation, CreateClaimableBalanceOperation }
