import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Table from 'react-bootstrap/lib/Table'
import {injectIntl, FormattedMessage} from 'react-intl'
import has from 'lodash/has'

import AccountLink from './shared/AccountLink'
import ClipboardCopy from './shared/ClipboardCopy'
import Logo from './shared/Logo'
import NewWindowIcon from './shared/NewWindowIcon'
import StellarTomlBadge from './shared/StellarTomlBadge'

import {assetKeyToIssuer, setTitle} from '../lib/utils'

import directory from '../data/directory'
const {anchors} = directory

class Anchor extends React.Component {
  render() {
    const {formatMessage} = this.props.intl

    const id = this.props.match.params.id
    const anchor = anchors[id]
    const domain = id
    const name = has(anchor, 'displayName') ? anchor.displayName : anchor.name

    if (!anchor || anchor == null) return null

    setTitle(`Anchor ${name}`)

    return (
      <Grid>
        <Row>
          <Panel
            header={
              <span>
                {formatMessage({id: 'anchor'})}{' '}
                <span className="secondary-heading">{name}</span>
              </span>
            }
          >
            <Table>
              <tbody>
                <tr>
                  <td>
                    <a href={anchor.website} target="_blank">
                      <Logo name={domain} type="anchor" />
                    </a>
                  </td>
                  <td>
                    <div>
                      {has(anchor, 'displayName')
                        ? anchor.displayName
                        : anchor.name}
                    </div>
                    <div style={{marginTop: 10}}>
                      <a href={anchor.website} target="_blank">
                        {anchor.website}
                        <NewWindowIcon />
                      </a>
                    </div>
                    <div style={{marginTop: 15}}>
                      <StellarTomlBadge domain={domain} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Panel>
        </Row>

        <Row style={{marginLeft: 10, marginRight: 10}}>
          <h3>
            <FormattedMessage id="assets" />
          </h3>
          <Table>
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="code" />
                </th>
                <th>
                  <FormattedMessage id="issuer" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(anchor.assets)
                .sort()
                .map(code => {
                  const issuer = assetKeyToIssuer(anchor.assets[code])
                  return (
                    <tr key={code}>
                      <td>{code}</td>
                      <td>
                        <AccountLink account={issuer} hideKnown />
                        <ClipboardCopy text={issuer} />
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        </Row>
      </Grid>
    )
  }
}

export default injectIntl(Anchor)
