import React from 'react'
import {Grid, Row} from 'react-bootstrap'
import {FormattedMessage} from 'react-intl'

class NoMatch extends React.Component {
  render() {
    const id = this.props.match.params.id
    return (
      <Grid>
        <Row>
          <h3>
            {id
              ? <FormattedMessage
                  id="error.cant.find"
                  values={{searchStr: id}}
                />
              : <FormattedMessage
                  id="error.nothing.found"
                  values={{path: this.props.location.pathname}}
                />}
          </h3>
        </Row>
      </Grid>
    )
  }
}

export default NoMatch
