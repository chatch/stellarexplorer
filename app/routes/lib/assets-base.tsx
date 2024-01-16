import { useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { FormattedMessage, useIntl } from 'react-intl'
import svgCircle from '../../../public/img/circle.svg'

import { setTitle } from '../../lib/utils'
import BackendResourceBadgeButton from '../../components/shared/BackendResourceBadgeButton'
import NewWindowIcon from '../../components/shared/NewWindowIcon'
import { TitleWithJSONButton } from '~/components/shared/TitleWithJSONButton'
import styles from './assets-base.module.css'
import { formatPercentToHumanReadable, formatPrice24h } from '~/lib/utilities'

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
  const holders = ` ${asset.trustlines[
    asset.trustlines.length - 1
  ].toLocaleString()}/${asset.trustlines[0].toLocaleString()}`
  const payments = asset.payments.toLocaleString()
  const supply = (asset.supply / 10_000_000).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })
  // NOTE: asset.price7d seems to have a maximum of 8 elements, each of which is an array of 2 elements.
  // And the elements are timestamp and price. And they are sorted in ascending order by timestamp.
  // So the last one is the most recent one.
  const latestPrice = asset.price7d[asset.price7d.length - 1][1]
  let previousPrice = null
  if (asset.price7d.length > 1) {
    previousPrice = asset.price7d[asset.price7d.length - 2][1] ?? null
  }
  const price24h = formatPrice24h(latestPrice)
  const priceChange = previousPrice
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
        {price24h}
        {previousPrice && latestPrice >= previousPrice ? (
          <span className={`${styles['price-change-up']}`}>
            {priceChange && `↑${priceChange}%`}
          </span>
        ) : (
          <span className={`${styles['price-change-down']}`}>
            {priceChange && `↓${priceChange}%`}
          </span>
        )}
        <span className={`${styles['text-small']}`}>USD</span>
      </td>
      <td>
        <div>
          <a href={`https://${asset.domain}`} target="_blank" rel="noreferrer">
            {asset.domain}
            {asset.domain && <NewWindowIcon />}
          </a>
        </div>
      </td>
      <td>
        <div className="stellarToml">
          <BackendResourceBadgeButton
            label="server.toml"
            url={`https://${asset.domain}/.well-known/stellar.toml`}
          />
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
          <CardHeader>
            <TitleWithJSONButton
              title={formatMessage({ id: 'assets' })}
              url={METADATA_URI}
            />
          </CardHeader>
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
