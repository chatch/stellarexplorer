import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import LumensRates from '../shared/LumensRates'

class Footer extends React.Component {
  render() {
    return (
      <Grid id="footer">
        <Row>
          <Col md={3}>
            <LumensRates />
          </Col>
          <Col mdOffset={2} md={3}>
            Donate: steexp*fed.network
          </Col>
          <Col mdOffset={3} md={1}>
            <a href="https://github.com/chatch/stellarexplorer">Github</a>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default Footer
