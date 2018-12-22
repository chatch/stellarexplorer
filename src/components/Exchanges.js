import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Table from 'react-bootstrap/lib/Table'
import {FormattedMessage, injectIntl} from 'react-intl'
import isEmpty from 'lodash/isEmpty'

import {decentralized, centralized} from '../data/exchanges.json'
import {setTitle} from '../lib/utils'
import AccountLink from './shared/AccountLink'
import Logo from './shared/Logo'
import NewWindowIcon from './shared/NewWindowIcon'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

const METADATA_PATH =
  'https://raw.githubusercontent.com/chatch/stellarexplorer/master/src/data/exchanges.json'

const Exchange = ({accounts, home, name, decentralized = false}) => {
  setTitle('Exchanges')
  const homeLink = `https://${home}`
  return (
    <tr className="directoryRow">
      <td>
        <a href={homeLink} target="_blank">
          <Logo name={name} type="exchange" />
        </a>
      </td>
      <td>
        <a href={homeLink} target="_blank">
          {home}
          <NewWindowIcon />
        </a>
      </td>
      <td>
        {!isEmpty(accounts) &&
          accounts.map(account => (
            <span key={account}>
              <AccountLink account={account} hideKnown={true} />
              &nbsp;
            </span>
          ))}
        {isEmpty(accounts) && decentralized && <span>Decentralized</span>}
      </td>
    </tr>
  )
}

const TableHeader = () => (
  <thead>
    <tr>
      <th />
      <th>
        <FormattedMessage id="home.domain" />
      </th>
      <th>
        <FormattedMessage id="account" />
      </th>
    </tr>
  </thead>
)

class Exchanges extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    const header = titleWithJSONButton(
      formatMessage({id: 'exchanges'}),
      METADATA_PATH
    )
    return (
      <Grid>
        <Row>
          <Panel header={header}>
            <h4 style={{textDecoration: 'underline'}}>Decentralized</h4>
            <Table>
              <TableHeader />
              <tbody>
                <tr>
                  <td />
                  <td />
                  <td />
                </tr>
                {Object.keys(decentralized).map(id => (
                  <Exchange
                    key={id}
                    name={id}
                    {...decentralized[id]}
                    decentralized
                  />
                ))}
              </tbody>
            </Table>

            <h4 style={{marginTop: 70, textDecoration: 'underline'}}>
              Centralized
            </h4>
            <Table>
              <TableHeader />
              <tbody>
                <tr>
                  <td />
                  <td />
                  <td />
                </tr>
                {Object.keys(centralized).map(id => (
                  <Exchange key={id} name={id} {...centralized[id]} />
                ))}
              </tbody>
            </Table>
          </Panel>
        </Row>
      </Grid>
    )
  }
}

export default injectIntl(Exchanges)
