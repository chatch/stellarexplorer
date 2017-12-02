import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import {FormattedMessage} from 'react-intl'

class NoMatchError extends React.Component {
  render() {
    const id = this.props.match.params.id
    return (
      <Grid>
        <Row>
          <h3>
            {id ? (
              <FormattedMessage id="error.cant.find" values={{searchStr: id}} />
            ) : (
              <FormattedMessage
                id="error.nothing.found"
                values={{path: this.props.location.pathname}}
              />
            )}
          </h3>
        </Row>
      </Grid>
    )
  }
}

export default NoMatchError
