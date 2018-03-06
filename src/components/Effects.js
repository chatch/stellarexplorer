import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import {injectIntl} from 'react-intl'
import EffectTable from './EffectTable'

class Effects extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    return (
      <Grid>
        <Row>
          <Panel header={formatMessage({id: 'effects'})}>
            <EffectTable limit={50} usePaging showAccount />
          </Panel>
        </Row>
      </Grid>
    )
  }
}

export default injectIntl(Effects)
