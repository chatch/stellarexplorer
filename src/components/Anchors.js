import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Table from 'react-bootstrap/lib/Table'
import {FormattedMessage, injectIntl} from 'react-intl'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'

import AccountLink from './shared/AccountLink'
import ClipboardCopy from './shared/ClipboardCopy'
import Logo from './shared/Logo'
import NewWindowIcon from './shared/NewWindowIcon'
import StellarTomlBadge from './shared/StellarTomlBadge'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

import {assetKeyToIssuer, setTitle} from '../lib/utils'

import directory from '../data/directory'
const {anchors} = directory

const METADATA_PATH =
  'https://raw.githubusercontent.com/irisli/stellarterm/master/directory/directory.json'

const tradeURL = (assetCode, issuerDomain) =>
  `https://stellarterm.com/#exchange/XLM-native/${assetCode}-${issuerDomain}`

// render list of asset codes, each code on a new line
const AssetCodeColumn = ({assets}) => (
  <span>
    {Object.keys(assets).map(code => (
      <div key={code}>{code}</div>
    ))}
  </span>
)

const IssuerColumn = ({assets}) => (
  <span>
    {Object.keys(assets).map(code => {
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

const TradeColumn = ({assets, domain}) => (
  <span>
    {Object.keys(assets).map(code => (
      <div key={code}>
        <a href={tradeURL(code, domain)} target="_blank">
          Trade
        </a>
      </div>
    ))}
  </span>
)

const Anchor = ({assets, domain, displayName, website}) => {
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
          <a href={website} target="_blank">
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

Anchor.propTypes = {
  assets: PropTypes.object.isRequired,
  domain: PropTypes.string.isRequired,
  website: PropTypes.string.isRequired,
}

class Anchors extends React.Component {
  render() {
    if (!anchors) return null
    setTitle('Anchors')
    const {formatMessage} = this.props.intl
    const header = titleWithJSONButton(
      formatMessage({id: 'anchors'}),
      METADATA_PATH
    )
    return (
      <Grid>
        <Row>
          <Panel header={header}>
            <Table>
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
                {Object.keys(anchors).map(domain => {
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
          </Panel>
        </Row>
      </Grid>
    )
  }
}

export default injectIntl(Anchors)
