import Table from 'react-bootstrap/Table'
import { FormattedMessage } from 'react-intl'
import type { Horizon } from 'stellar-sdk'

import { type LiquidityPoolProps } from './operations/LiquidityPool'
import { liquidityPoolAsset } from '~/data/liquidity_pool_asset'
import { formatAmountToHumanReadable, getAssetCode } from '~/lib/utilities'

interface ParentProps {
  compact: boolean
  // horizonURL: string
}

interface LiquidityPoolRowProps extends LiquidityPoolProps, ParentProps {}

interface LiquidityPoolTableProps {
  compact: boolean
  records: ReadonlyArray<LiquidityPoolProps>
  // horizonURL?: string
}

const fallBackAssetIcon = 'img/circle.svg'

const PoolAsset = ({
  reserves,
}: {
  reserves: Horizon.Reserve[]
}): React.JSX.Element => {
  return (
    <div>
      <span>
        {reserves.map(({ asset, amount }, index) => {
          const assetCode = getAssetCode(asset)

          const icon = liquidityPoolAsset[assetCode]?.icon || fallBackAssetIcon
          const url = liquidityPoolAsset[assetCode]?.url

          return (
            <div key={index}>
              <img
                src={icon}
                alt={assetCode}
                className="liquidity-pool-asset-image"
              />
              <span className="liquidity-pool-asset">
                {assetCode} {url}
              </span>
              <span className="liquidity-pool-amount">
                {formatAmountToHumanReadable(amount)}
              </span>
            </div>
          )
        })}
      </span>
    </div>
  )
}

const LiquidityPoolRow = ({
  // compact,
  id,
  totalTrustlines,
  totalShares,
  reserves,
}: LiquidityPoolRowProps): React.JSX.Element => (
  <tr>
    <td>
      <PoolAsset reserves={reserves} />
    </td>
    <td className="liquidity-pool-shares">
      {formatAmountToHumanReadable(totalShares)}
    </td>
    <td className="liquidity-pool-trustlines">{totalTrustlines}</td>
  </tr>
)

export default function LiquidityPoolTable({
  compact,
  records, // horizonURL,
}: LiquidityPoolTableProps) {
  return (
    <div>
      <Table
        id="liquidity-pool-table"
        className="table-striped table-hover table-condensed"
      >
        <thead>
          <tr>
            <th>
              <FormattedMessage id="liquidity-pool.assets" />
            </th>
            {/* commented out as it's not certain how to display the values. */}
            {/* we also might need to reconsider what to be displayed. */}
            {/* <th>
              <FormattedMessage id="liquidity-pool.liquidity" />
            </th>
            <th>
              <FormattedMessage id="liquidity-pool.apy" />
            </th>
            <th>
              <FormattedMessage id="liquidity-pool.vol-24h" />
            </th>
            <th>
              <FormattedMessage id="liquidity-pool.fee-24h" />
            </th> */}
            <th>
              <FormattedMessage id="liquidity-pool.shares" />
            </th>
            <th>
              <FormattedMessage id="liquidity-pool.trustlines" />
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {records.map((pool) => (
            <LiquidityPoolRow key={pool.id} compact={compact} {...pool} />
          ))}
        </tbody>
      </Table>
    </div>
  )
}
