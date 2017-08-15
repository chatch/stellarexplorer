import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import {injectIntl} from 'react-intl'

import anchors from '../data/anchors'
import AccountLink from './shared/AccountLink'
import Logo from './shared/Logo'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

const METADATA_PATH =
  'https://github.com/chatch/stellarexplorer/src/data/anchors.js'

const Anchor = anchor =>
  <div>
    <Row style={{marginTop: 20, marginBottom: 20}}>
      <Col md={3}>
        <a href={`https://${anchor.home}`}>
          <Logo img={anchor.img} name={anchor.name} />
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
