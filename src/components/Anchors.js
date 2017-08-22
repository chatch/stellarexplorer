import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import {FormattedMessage, injectIntl} from 'react-intl'
import has from 'lodash/has'

import anchors from '../data/anchors'
import AccountLink from './shared/AccountLink'
import Logo from './shared/Logo'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'
import BadgeButton from './shared/BadgeButton'

const METADATA_PATH =
  'https://github.com/chatch/stellarexplorer/blob/master/src/data/anchors.js'

const Anchor = ({currencies, home, img, name, toml}) => {
  const homePage = `https://${home}`
  return (
    <div>
      <Row style={{marginTop: 25, marginBottom: 25}}>
        <Col md={2}>
          <a href={homePage}>
            <Logo img={img} name={name} />
          </a>
        </Col>
        <Col md={3}>
          <div>
            {name}
          </div>
          <div>
            <a href={homePage}>
              {homePage}
            </a>
          </div>
          <div>
            <BadgeButton
              label="server.toml"
              url={toml ? toml : `${homePage}/.well-known/stellar.toml`}
            />
          </div>
        </Col>
        {Object.keys(currencies).map(code => {
          const currency = currencies[code]
          return (
            <div>
              <Col md={1}>
                {code}
              </Col>
              <Col md={6}>
                <span>
                  <FormattedMessage id="issuer" />:&nbsp;
                </span>
                <AccountLink account={currency.issuer} hideKnown />
                {has(currency, 'distributers') &&
                  <span>
                    <span>
                      ,&nbsp;<FormattedMessage id="distributers" />:&nbsp;
                    </span>
                    {currency.distributers.map(distAcc =>
                      <span>
                        <AccountLink account={distAcc} hideKnown />&nbsp;
                      </span>
                    )}
                  </span>}
              </Col>
            </div>
          )
        })}
      </Row>
    </div>
  )
}

const AnchorsList = () =>
  <div>
    {Object.keys(anchors).map(name => {
      const anchor = anchors[name]
      return <Anchor key={name} name={name} {...anchor} />
    })}
  </div>

class Anchors extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    const header = titleWithJSONButton(
      formatMessage({id: 'anchors'}),
      METADATA_PATH
    )
    return (
      <Grid>
        <Row>
          <Panel header={header}>
            <AnchorsList />
          </Panel>
        </Row>
        <Row />
      </Grid>
    )
  }
}

export default injectIntl(Anchors)
