import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import {injectIntl, FormattedMessage} from 'react-intl'
import anchors from '../lib/Anchors'
import AccountLink from './shared/AccountLink'
import AnchorLogo from './shared/AnchorLogo'

const Anchor = anchor =>
  <div>
    <Row style={{marginBottom: 20}}>
      <Col md={3}>
        <a href={`https://${anchor.home}`}>
          <AnchorLogo anchor={anchor} />
        </a>
      </Col>
      <Col md={3}>
        <a href={`https://${anchor.home}`}>
          {anchor.name}
        </a>
      </Col>
      <Col md={6}>
        <AccountLink account={anchor.id} label={anchor.id} />
      </Col>
    </Row>
  </div>

const AnchorsList = () =>
  <div>
    {Object.keys(anchors).map(id =>
      <Anchor key={id} id={id} {...anchors[id]} />
    )}
  </div>

class Anchors extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    return (
      <Grid>
        <Row>
          <Panel header={formatMessage({id: 'anchors'})}>
            <AnchorsList />
            <div
              style={{
                paddingTop: 30,
              }}
            >
              <FormattedMessage id="anchors.notice" />
            </div>
          </Panel>
        </Row>
        <Row />
      </Grid>
    )
  }
}

export default injectIntl(Anchors)
