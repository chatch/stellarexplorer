import type { PropsWithChildren } from 'react'
import AccountLink from '../shared/AccountLink'
import Asset from '../shared/Asset'
import type { HorizonApi } from 'stellar-sdk/lib/horizon'

export interface ClaimableBalanceProps extends PropsWithChildren {
  id: string
  pagingToken: string
  asset: string
  amount: string
  sponsor: string
  claimants: HorizonApi.Claimant[]
  lastModifiedTime: string
}

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
