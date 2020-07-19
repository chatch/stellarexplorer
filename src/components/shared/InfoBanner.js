import React from 'react'
import Col from 'react-bootstrap/lib/Col'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'

// import FetchPonyfill from 'fetch-ponyfill'
// import isEmpty from 'lodash/isEmpty'

// const fetch = FetchPonyfill().fetch

// const BANNER_JSON =
//   'https://raw.githubusercontent.com/chatch/stellarexplorer/master/banner.json'

const InfoBanner = ({message}) => (
  <Grid style={{marginBottom: 0}}>
    <Row>
      <Col style={{marginTop: 0, marginBottom: 0, paddingLeft: 0}}>
        <div class="dark" data-ea-publisher="steexp" data-ea-type="text"></div>
  {/*
        <div class="dark" data-ea-publisher="steexp" data-ea-type="image"></div> 
   */}

  {/* <span id="banner-message" dangerouslySetInnerHTML={{__html: message}} /> */}
      </Col>
    </Row>
  </Grid>
)

// class InfoBannerContainer extends React.Component {
//   state = {}

//   componentDidMount() {
//     fetch(BANNER_JSON)
//       .then(rsp => rsp.json())
//       .then(({message, expiry}) => {
//         if (
//           !isEmpty(message) &&
//           Number.isInteger(Number(expiry)) &&
//           expiry > Date.now()
//         ) {
//           this.setState({message})
//         }
//       })
//       .catch(err => {
//         console.error(`Failed to fetch banner.json: [${err}]`)
//         console.error(`stack: [${err.stack}]`)
//       })
//   }

//   render() {
//     return <InfoBanner message={this.state.message} />
//   }
// }

export default InfoBanner
