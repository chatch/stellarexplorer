import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Table from 'react-bootstrap/lib/Table'
import {FormattedMessage, injectIntl} from 'react-intl'
import PropTypes from 'prop-types'

import AccountLink from './shared/AccountLink'
import BackendResourceBadgeButton from './shared/BackendResourceBadgeButton'
import Logo from './shared/Logo'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

import directory from '../data/directory'
const {anchors, assets} = directory

const METADATA_PATH =
  'https://raw.githubusercontent.com/irisli/stellarterm/master/directory/directory.json'

const Asset = ({code, domain, issuer}) => {
  const anchor = anchors[domain]
  return (
    <tr className="directoryRow">
      <td>
        <a href={anchor.website} target="_blank">
          <Logo name={domain} src={anchor.logo} />
        </a>
      </td>
      <td style={{color: 'white'}}>{code}</td>
      <td>
        <AccountLink account={issuer} hideKnown />
      </td>
      <td className="stellarToml">
        <div>{anchor.name}</div>
        <div>
          <a href={anchor.website} target="_blank">
            {anchor.website}
          </a>
        </div>
        <div>
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
    if (!assets) return null
    const {formatMessage} = this.props.intl
    const header = titleWithJSONButton(
      formatMessage({id: 'assets'}),
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
                {Object.keys(assets)
                  .sort()
                  .map(key => {
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
