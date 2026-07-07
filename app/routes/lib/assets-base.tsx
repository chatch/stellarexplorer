import { useEffect } from 'react'
import { Card, Container, Row, Table } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import { setTitle } from '../../lib/utils'
import BackendResourceBadgeButton from '../../components/shared/BackendResourceBadgeButton'
import NewWindowIcon from '../../components/shared/NewWindowIcon'
import { TitleWithJSONButton } from '~/components/shared/TitleWithJSONButton'
import styles from './assets-base.module.css'
import { formatPercentToHumanReadable, formatPrice24h } from '~/lib/utilities'
import { publicAssetUrl } from '~/lib/build-target'

const svgCircle = publicAssetUrl('img/circle.svg')

export const METADATA_URI =
  'https://raw.githubusercontent.com/irisli/stellarterm/master/directory/directory.json'

export interface AssetProps {
  asset: string
  supply: number
  traded_amount: number
  payments_amount: number
  created: number
  trustlines: number[]
  payments: number
  domain?: string
  rating: {
    age: number
    trades: number
    payments: number
    trustlines: number
    volume7d: number
    interop: number
    liquidity: number
    average: number
  }
  price7d: number[][]
  volume7d: number
  tomlInfo?: {
    code?: string
    issuer?: string
    name?: string
    image?: string
    anchorAssetType?: string
    anchorAsset?: string
    orgName?: string
    orgLogo?: string
  }
  paging_token: number
}

const getAssetImage = (asset: AssetProps) => {
  if (asset.tomlInfo?.image) {
    return asset.tomlInfo.image
  }
  if (asset.asset.startsWith('XLM') || asset.asset.startsWith('yXLM')) {
    return 'https://ipfs.io/ipfs/bafkreihntcz2lpaxawmbhwidtuifladkgew6olwuly2dz5pewqillhhpay'
  }
  return svgCircle
}

const getAssetCode = (asset: AssetProps) => {
  if (asset.tomlInfo?.code) {
    return asset.tomlInfo.code
  }
  return asset.asset.split('-')[0]
}

export function Asset(asset: AssetProps) {
  const displayDate = asset.created
    ? new Date(asset.created * 1000).toLocaleDateString('sv-SE')
    : ''
  const trustlines = Array.isArray(asset.trustlines) ? asset.trustlines : []
  const holders =
    trustlines.length > 0
      ? ` ${trustlines[trustlines.length - 1].toLocaleString()}/${trustlines[0].toLocaleString()}`
      : ''
  const payments = asset.payments != null ? asset.payments.toLocaleString() : ''
  const supply =
    asset.supply != null
      ? (asset.supply / 10_000_000).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })
      : ''
  // NOTE: asset.price7d seems to have a maximum of 8 elements, each of which is an array of 2 elements.
  // And the elements are timestamp and price. And they are sorted in ascending order by timestamp.
  // So the last one is the most recent one. Low-activity assets returned by asset search may have
  // an empty/missing price7d, so guard every access.
  const price7d = Array.isArray(asset.price7d) ? asset.price7d : []
  const latestEntry = price7d[price7d.length - 1]
  const latestPrice = latestEntry ? latestEntry[1] : null
  let previousPrice = null
  if (price7d.length > 1) {
    previousPrice = price7d[price7d.length - 2][1] ?? null
  }
  const price24h = latestPrice != null ? formatPrice24h(latestPrice) : undefined
  const priceChange =
    previousPrice != null && latestPrice != null
      ? formatPercentToHumanReadable(
          Math.abs(((latestPrice - previousPrice) * 100) / latestPrice),
        )
      : undefined

  return (
    <tr className="directoryRow">
      <td>
        <img
          src={getAssetImage(asset)}
          alt={getAssetCode(asset)}
          className={styles['asset-image']}
        />
        <span className={styles['asset-code']}>{getAssetCode(asset)}</span>
      </td>
      <td>{displayDate}</td>
      <td className={styles['assets-cell']}>{supply}</td>
      <td className={styles['assets-cell']}>{holders}</td>
      <td className={styles['assets-cell']}>{payments}</td>
      <td className={styles['assets-cell']}>
        {price24h != null && (
          <>
            {price24h}
            {previousPrice != null &&
            latestPrice != null &&
            latestPrice >= previousPrice ? (
              <span className={`${styles['price-change-up']}`}>
                {priceChange && `↑${priceChange}%`}
              </span>
            ) : (
              <span className={`${styles['price-change-down']}`}>
                {priceChange && `↓${priceChange}%`}
              </span>
            )}
            <span className={`${styles['text-small']}`}>USD</span>
          </>
        )}
      </td>
      <td>
        <div>
          {asset.domain ? (
            <a
              href={`https://${asset.domain}`}
              target="_blank"
              rel="noreferrer"
            >
              {asset.domain}
              <NewWindowIcon />
            </a>
          ) : (
            ''
          )}
        </div>
      </td>
      <td>
        <div className="stellarToml">
          {asset.domain && (
            <BackendResourceBadgeButton
              label="server.toml"
              url={`https://${asset.domain}/.well-known/stellar.toml`}
            />
          )}
        </div>
      </td>
    </tr>
  )
}

export function Assets({ assets }: { assets: AssetProps[] }) {
  const { formatMessage } = useIntl()

  useEffect(() => {
    setTitle('Assets')
  }, [])

  return (
    <Container>
      <Row>
        <Card>
          <Card.Header>
            <TitleWithJSONButton
              title={formatMessage({ id: 'assets' })}
              url={METADATA_URI}
            />
          </Card.Header>
          <Card.Body>
            <Table id="assets-table">
              <thead>
                <tr>
                  <th>
                    <FormattedMessage id="asset" />
                  </th>
                  <th>
                    <FormattedMessage id="created" />
                  </th>
                  <th className={styles['assets-cell']}>
                    <FormattedMessage id="supply" />
                  </th>
                  <th className={styles['assets-cell']}>
                    <FormattedMessage id="holders" />
                  </th>
                  <th className={styles['assets-cell']}>
                    <FormattedMessage id="payments" />
                  </th>
                  <th className={styles['assets-cell']}>
                    <FormattedMessage id="price(24h)" />
                  </th>
                  <th>URL</th>
                  <th>server.toml</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => {
                  return <Asset key={asset.asset} {...asset} />
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
