import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import {injectIntl} from 'react-intl'
import isEmpty from 'lodash/isEmpty'

import {decentralized, centralized} from '../data/exchanges'
import AccountLink from './shared/AccountLink'
import Logo from './shared/Logo'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

const METADATA_PATH =
  'https://github.com/chatch/stellarexplorer/blob/master/src/data/exchanges.js'

const Exchange = ({accounts, home, name, logo, decentralized = false}) => {
  const homeLink = `https://${home}`
  return (
    <Row style={{marginTop: 30, marginBottom: 30}}>
      <Col md={4}>
        <a href={homeLink} target="_blank">
          <Logo name={name} src={logo} />
        </a>
      </Col>
      <Col md={5}>
        <a href={homeLink} target="_blank">
          {home}
        </a>
      </Col>
      <Col md={2}>
        {!isEmpty(accounts) &&
          accounts.map(account => (
            <span key={account}>
              <AccountLink account={account} hideKnown={true} />&nbsp;
            </span>
          ))}
        {decentralized && <span>Decentralized</span>}
      </Col>
    </Row>
  )
}

const ExchangesList = () => (
  <div>
    <div>
      {Object.keys(decentralized).map(id => (
        <Exchange key={id} name={id} {...decentralized[id]} decentralized />
      ))}
    </div>
    <Row style={{marginTop: 30, marginBottom: 30}}>
      <Col md={12}>
        <hr />
      </Col>
    </Row>
    <div>
      {Object.keys(centralized).map(id => (
        <Exchange key={id} name={id} {...centralized[id]} />
      ))}
    </div>
  </div>
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
          <Col mdOffset={3} md={6}>
            <Panel header={header}>
              <ExchangesList />
            </Panel>
          </Col>
        </Row>
        <Row />
      </Grid>
    )
  }
}

export default injectIntl(Exchanges)
