import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import {injectIntl} from 'react-intl'
import isEmpty from 'lodash/isEmpty'

import exchanges from '../data/exchanges'
import AccountLink from './shared/AccountLink'
import Logo from './shared/Logo'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

const METADATA_PATH =
  'https://github.com/chatch/stellarexplorer/blob/master/src/data/exchanges.js'

const Exchange = ({accounts, home, name, logo}) => {
  const homePage = `https://${home}`
  return (
    <Row style={{marginTop: 30, marginBottom: 30}}>
      <Col md={4}>
        <a href={homePage} target="_blank">
          <Logo name={name} src={logo} />
        </a>
      </Col>
      <Col md={5}>
        <a href={homePage} target="_blank">{homePage}</a>
      </Col>
      <Col md={2}>
        {!isEmpty(accounts) &&
          accounts.map(account => (
            <span key={account}>
              <AccountLink account={account} hideKnown={true} />&nbsp;
            </span>
          ))}
        {name === 'StellarTerm' && <span>Decentralized</span>}
      </Col>
    </Row>
  )
}

const ExchangesList = () => (
  <div>
    {Object.keys(exchanges).map(id => (
      <Exchange key={id} name={id} {...exchanges[id]} />
    ))}
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
