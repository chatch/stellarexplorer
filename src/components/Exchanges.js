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

const Exchange = ({accounts, aggregator = false, home, name}) => {
  const homePage = `https://${home}`
  return (
    <div>
      <Row style={{marginTop: 20, marginBottom: 20}}>
        <Col md={3}>
          <a href={homePage}>
            <Logo name={name} />
          </a>
        </Col>
        <Col md={3}>
          <a href={homePage}>
            {homePage}
          </a>
        </Col>
        <Col md={6}>
          {aggregator === true && <span>Aggregator</span>}
          {aggregator !== true &&
            !isEmpty(accounts) &&
            accounts.map(account =>
              <span key={account}>
                <AccountLink account={account} hideKnown={true} />&nbsp;
              </span>
            )}
        </Col>
      </Row>
    </div>
  )
}

const ExchangesList = () =>
  <div>
    {Object.keys(exchanges).map(id =>
      <Exchange key={id} name={id} {...exchanges[id]} />
    )}
  </div>

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
            <ExchangesList />
          </Panel>
        </Row>
        <Row />
      </Grid>
    )
  }
}

export default injectIntl(Exchanges)
