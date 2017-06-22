import React from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
import LumensRates from './LumensRates'

class Footer extends React.Component {
  render() {
    return (
      <Grid id="footer">
        <Row>
          <Col>
            <LumensRates />
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default Footer
