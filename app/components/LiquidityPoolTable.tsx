import Table from 'react-bootstrap/Table'
import { FormattedMessage } from 'react-intl'
import { Horizon } from 'stellar-sdk'

import type { LiquidityPoolProps } from './operations/LiquidityPool'
import { liquidityPoolAsset } from '~/data/liquidity_pool_asset'
import { formatAmountToHumanReadable } from '~/lib/utils'

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
        {reserves.map(({ asset, amount }) => {
          // TODO: refactor this because the same code exists in app/components/operations/LiquidityPool.tsx.
          let assetStr
          if (asset === 'native') {
            assetStr = 'XLM'
          } else {
            const [code] = asset.split(':')
            assetStr = code
          }

          const icon = liquidityPoolAsset[assetStr]?.icon || fallBackAssetIcon
          const url = liquidityPoolAsset[assetStr]?.url

          return (
            <div>
              <img
                src={icon}
                alt={assetStr}
                className="liquidity-pool-asset-image"
              />
              <span className="liquidity-pool-asset">
                {assetStr} {url}
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
