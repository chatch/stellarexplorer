import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import {injectIntl} from 'react-intl'
import PaymentTable from './PaymentTable'
import {setTitle} from '../lib/utils'

class Payments extends React.Component {
  render() {
    const {formatMessage} = this.props.intl
    setTitle('Payments')
    return (
      <Grid>
        <Row>
          <Panel header={formatMessage({id: 'payments'})}>
            <PaymentTable compact={false} limit={50} usePaging />
          </Panel>
        </Row>
      </Grid>
    )
  }
}

export default injectIntl(Payments)
