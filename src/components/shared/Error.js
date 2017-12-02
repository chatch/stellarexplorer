import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import {FormattedMessage} from 'react-intl'

const knownErrors = ['network']

class Error extends React.Component {
  render() {
    const id = this.props.match.params.id
    return (
      <Grid>
        <Row>
          <h3>
            {id && knownErrors.indexOf(id) !== -1 ? (
              <FormattedMessage id={`error.${id}`} />
            ) : (
              <FormattedMessage id="error.unknown" />
            )}
          </h3>
        </Row>
      </Grid>
    )
  }
}

export default Error
