import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Table from 'react-bootstrap/lib/Table'
import {FormattedMessage, injectIntl} from 'react-intl'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import has from 'lodash/has'

import {setTitle} from '../lib/utils'
import AccountLink from './shared/AccountLink'
import BackendResourceBadgeButton from './shared/BackendResourceBadgeButton'
import ClipboardCopy from './shared/ClipboardCopy'
import Logo from './shared/Logo'
import NewWindowIcon from './shared/NewWindowIcon'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

import directory from '../data/directory'
const {anchors, assets} = directory

const METADATA_PATH =
  'https://raw.githubusercontent.com/irisli/stellarterm/master/directory/directory.json'

const Asset = ({code, domain, issuer}) => {
  setTitle('Assets')
  const anchor = anchors[domain]
  return (
    <tr className="directoryRow">
      <td>
        <a href={anchor.website} target="_blank">
          <Logo name={domain} type="anchor" />
        </a>
      </td>
      <td style={{color: 'white'}}>{code}</td>
      <td>
        <AccountLink account={issuer} hideKnown />
        <ClipboardCopy text={issuer} />
      </td>
      <td>
        <div>
          <Link to={`/anchor/${domain}`}>{anchor.name}</Link>
        </div>
        <div>
          <a href={anchor.website} target="_blank">
            {anchor.website}
            <NewWindowIcon />
          </a>
        </div>
        <div className="stellarToml">
          <BackendResourceBadgeButton
            label="server.toml"
            url={`https://${domain}/.well-known/stellar.toml`}
          />
        </div>
      </td>
    </tr>
  )
}

Asset.propTypes = {
  code: PropTypes.string.isRequired,
  issuer: PropTypes.string.isRequired,
}

class Assets extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    const header = titleWithJSONButton(
      formatMessage({id: 'assets'}),
      METADATA_PATH
    )

    // if we have a code from /asset/<code> then show only assets with code
    // starting with <code>; otherwise show all assets (/assets)
    const allAssetKeys = Object.keys(assets)
    const assetKeys = has(this.props, 'match.params.id')
      ? allAssetKeys.filter(k =>
          k.startsWith(this.props.match.params.id.toUpperCase())
        )
      : allAssetKeys

    return (
      <Grid>
        <Row>
          <Panel header={header}>
            <Table>
              <thead>
                <tr>
                  <th />
                  <th>
                    <FormattedMessage id="code" />
                  </th>
                  <th>
                    <FormattedMessage id="issuer" />
                  </th>
                  <th>
                    <FormattedMessage id="anchor" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {assetKeys.sort().map(key => {
                  const asset = assets[key]
                  return <Asset key={key} {...asset} />
                })}
              </tbody>
            </Table>
          </Panel>
        </Row>
      </Grid>
    )
  }
}

export default injectIntl(Assets)
