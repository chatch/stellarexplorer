import React from 'react'
import { Container, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

class NoMatchError extends React.Component {
  render() {
    const id = this.props.match.params.id
    return (
      <Container>
        <Row>
          <h3>
            {id ? (
              <FormattedMessage
                id="error.cant.find"
                values={{ searchStr: id }}
              />
            ) : (
              <FormattedMessage
                id="error.nothing.found"
                values={{ path: this.props.location.pathname }}
              />
            )}
          </h3>
        </Row>
      </Container>
    )
  }
}

export default NoMatchError