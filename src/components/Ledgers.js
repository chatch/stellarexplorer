import React from 'react'
import {Grid, Panel, Row} from 'react-bootstrap'
import {injectIntl} from 'react-intl'
import LedgerTable from './LedgerTableContainer'

class Ledgers extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    return (
      <Grid>
        <Row>
          <Panel header={formatMessage({id: 'ledgers'})}>
            <LedgerTable usePaging limit={20}/>
          </Panel>
        </Row>
      </Grid>
    )
  }
}

export default injectIntl(Ledgers)
