import React from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
import LumensRates from '../shared/LumensRates'

class Footer extends React.Component {
  render() {
    return (
      <Grid id="footer">
        <Row>
          <Col md={1}>
            Github{' '}
          </Col>
          <Col md={3}>
            <LumensRates />
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default Footer
