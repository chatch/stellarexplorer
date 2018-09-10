import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import {FormattedMessage} from 'react-intl'

class InsecureNetworkError extends React.Component {
  render() {
    const uri = this.props.location.search.replace('?', '')
    return (
      <Grid>
        <Row>
          <h3>
            <FormattedMessage id="error.occurred" />
            {uri ? (
              <FormattedMessage id="error.insecure-network.uri" values={{uri: uri}} />
            ) : (
              <FormattedMessage
                id="error.insecure-network"
              />
            )}
          </h3>
          <FormattedMessage id="error.insecure-network.reason" />
        </Row>
      </Grid>
    )
  }
}

export default InsecureNetworkError
