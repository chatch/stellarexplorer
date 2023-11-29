import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import AccountLink from '../components/shared/AccountLink'
import ClipboardCopy from '../components/shared/ClipboardCopy'
import Logo from '../components/shared/Logo'
import NewWindowIcon from '../components/shared/NewWindowIcon'
import StellarTomlBadge from '../components/shared/StellarTomlBadge'

import { assetKeyToIssuer, setTitle } from '../lib/utils'

import directory from '../data/directory'
import { TitleWithJSONButton } from '~/components/shared/TitleWithJSONButton'
import { useEffect } from 'react'
const { anchors } = directory

const METADATA_URI =
  'https://raw.githubusercontent.com/irisli/stellarterm/master/directory/directory.json'

const tradeURL = (assetCode: string, issuerDomain: string): string =>
  `https://stellarterm.com/#exchange/XLM-native/${assetCode}-${issuerDomain}`

// render list of asset codes, each code on a new line
const AssetCodeColumn = ({ assets }: { assets: Record<string, string> }) => (
  <span>
    {Object.keys(assets).map((code) => (
      <div key={code}>{code}</div>
    ))}
  </span>
)

const IssuerColumn = ({ assets }: { assets: Record<string, string> }) => (
  <span>
    {Object.keys(assets).map((code) => {
      const issuer = assetKeyToIssuer(assets[code])
      return (
        <div key={code}>
          <AccountLink account={issuer} hideKnown />
          <ClipboardCopy text={issuer} />
        </div>
      )
    })}
  </span>
)

const TradeColumn = ({
  assets,
  domain,
}: {
  assets: Record<string, string>
  domain: string
}) => (
  <span>
    {Object.keys(assets).map((code) => (
      <div key={code}>
        <a href={tradeURL(code, domain)} target="_blank" rel="noreferrer">
          Trade
        </a>
      </div>
    ))}
  </span>
)

interface AnchorProps {
  // map of asset code to <asset code>-<address>
  assets: Record<string, string>
  domain: string
  website: string
  displayName?: string
}

const Anchor = ({ assets, domain, displayName, website }: AnchorProps) => {
  return (
    <tr className="directoryRow">
      <td>
        <Link to={`/anchor/${domain}`}>
          <Logo name={domain} type="anchor" />
        </Link>
      </td>
      <td className="anchorLinkCol">
        <div>
          <Link to={`/anchor/${domain}`}>{displayName}</Link>
        </div>
        <div>
          <a href={website} target="_blank" rel="noreferrer">
            {website}
            <NewWindowIcon />
          </a>
        </div>
        <div>
          <StellarTomlBadge domain={domain} />
        </div>
      </td>
      <td>
        <AssetCodeColumn assets={assets} />
      </td>
      <td>
        <IssuerColumn assets={assets} />
      </td>
      <td>
        <TradeColumn assets={assets} domain={domain} />
      </td>
    </tr>
  )
}

export default function Anchors() {
  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle('Anchors')
  }, [])
  if (!anchors) return null
  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <TitleWithJSONButton
              title={formatMessage({ id: 'anchors' })}
              url={METADATA_URI}
            />
          </CardHeader>
          <Card.Body>
            <Table id="anchors-table">
              <thead>
                <tr>
                  <th />
                  <th />
                  <th>
                    <FormattedMessage id="asset" />
                  </th>
                  <th>
                    <FormattedMessage id="issuer" />
                  </th>
                  <th>StellarTerm</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(anchors).map((domain) => {
                  const anchor = anchors[domain]
                  if (anchor.defunct && anchor.defunct === true) return null
                  return (
                    <Anchor
                      key={domain}
                      assets={anchor.assets}
                      domain={domain}
                      displayName={anchor.displayName}
                      website={anchor.website}
                    />
                  )
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
