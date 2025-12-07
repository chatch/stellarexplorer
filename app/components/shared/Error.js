import React from 'react'
import { Container, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const knownErrors = ['network']

class Error extends React.Component {
  render() {
    const id = this.props.match.params.id
    return (
      <Container>
        <Row>
          <h3>
            {id && knownErrors.indexOf(id) !== -1 ? (
              <FormattedMessage id={`error.${id}`} />
            ) : (
              <FormattedMessage id="error.unknown" />
            )}
          </h3>
        </Row>
      </Container>
    )
  }
}

export default Error