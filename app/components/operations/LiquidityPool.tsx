import AccountLink from '../shared/AccountLink'
import type { PropsWithChildren } from 'react'
import type { HorizonApi } from 'stellar-sdk/lib/horizon'
import { getAssetCode } from '~/lib/utilities'

export interface LiquidityPoolProps extends PropsWithChildren {
  id: string
  totalTrustlines: string
  totalShares: string
  reserves: HorizonApi.Reserve[]
  pagingToken: string
}

const LiquidityPoolDeposit = ({
  sourceAccount,
  reservesDeposited,
  sharesReceived,
}: any) => (
  <span>
    <AccountLink account={sourceAccount} /> deposited&nbsp;
    {reservesDeposited
      .map(({ asset, amount }: any) => {
        return `${amount} ${getAssetCode(asset)}`
      })
      .join(', ')}{' '}
    for&nbsp;
    {sharesReceived}&nbsp; shares in liquidity pool
  </span>
)

const LiquidityPoolWithdraw = ({
  sourceAccount,
  reservesReceived,
  shares, // op uses this
  sharesRedeemed, // effect uses this
}: any) => (
  <span>
    <AccountLink account={sourceAccount} /> withdrew&nbsp;
    {shares || sharesRedeemed}&nbsp; shares in liquidity pool for&nbsp;
    {reservesReceived
      .map(({ asset, amount }: any) => {
        return `${amount} ${getAssetCode(asset)}`
      })
      .join(', ')}
  </span>
)

export { LiquidityPoolDeposit, LiquidityPoolWithdraw }
