import React from 'react'
import Col from 'react-bootstrap/lib/Col'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import FetchPonyfill from 'fetch-ponyfill'

const fetch = FetchPonyfill().fetch

const SPONSOR_LINK_JSON =
  'https://raw.githubusercontent.com/chatch/stellarexplorer/master/banner.json'

const SponsoredLink = ({link}) =>
  <Grid>
    <Row>
      <Col style={{marginBottom: 15, paddingLeft: 15}}>
        Sponsored Link:{' '}
        <span dangerouslySetInnerHTML={{__html: link.message}} />
      </Col>
    </Row>
  </Grid>

class SponsoredLinkContainer extends React.Component {
  componentDidMount() {
    fetch(SPONSOR_LINK_JSON)
      .then(rsp => rsp.json())
      .then(json => this.setState({link: json}))
      .catch(err => {
        console.error(`Failed to fetch sponsored link: [${err}]`)
        console.error(`stack: [${err.stack}]`)
      })
  }

  render() {
    if (!this.state) return null
    return <SponsoredLink {...this.state} />
  }
}

export default SponsoredLinkContainer
