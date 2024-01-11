import Table from 'react-bootstrap/Table'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import { type LiquidityPoolProps } from './operations/LiquidityPool'
import { liquidityPoolAsset } from '~/data/liquidity_pool_asset'
import { formatAmountToHumanReadable, getAssetCode } from '~/lib/utilities'

import styles from './LiquidityPoolTable.module.css'
import type { HorizonApi } from 'stellar-sdk/lib/horizon'

interface ParentProps {
  compact: boolean
}

interface LiquidityPoolRowProps extends LiquidityPoolProps, ParentProps {}

interface LiquidityPoolTableProps {
  compact: boolean
  records: ReadonlyArray<LiquidityPoolProps>
}

const fallBackAssetIcon = '/img/circle.svg'

export const PoolAsset = ({
  reserves,
}: {
  reserves: HorizonApi.Reserve[]
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
                className={styles['asset-image']}
              />
              <span className={styles['asset-code']}>
                {assetCode} <span className={styles['asset-url']}>{url}</span>
              </span>
              <span className={styles['amount']}>
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
  id,
  totalTrustlines,
  totalShares,
  reserves,
}: LiquidityPoolRowProps): React.JSX.Element => (
  <tr>
    <td>
      <Link to={`/pools/${id}`}>
        <PoolAsset reserves={reserves} />
      </Link>
    </td>
    <td className={styles['shares']}>
      {formatAmountToHumanReadable(totalShares)}
    </td>
    <td className={styles['trustlines']}>{totalTrustlines}</td>
  </tr>
)

export default function LiquidityPoolTable({
  compact,
  records,
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
