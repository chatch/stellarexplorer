import React from 'react'
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
import propTypes from 'prop-types'

import AccountLink from './shared/AccountLink'

const effectBaseProps = [
  'id',
  'account',
  'type',
  'typeI',
  'links',
  'pagingToken',
]

const Effect = ({compact, effect, effectURLFn}) => (
  <Row key={effect.id} className="effect">
    <Col md={1}>
      <AccountLink account={effect.account} />
    </Col>
    <Col md={3}>{effect.type}</Col>
    <Col md={8}>
      <span>
        {Object.keys(effect)
          .filter(key => effectBaseProps.indexOf(key) === -1)
          .filter(key => typeof effect[key] !== 'function')
          .map(key => {
            let value = effect[key]
            if (value === '') value = '<empty>'
            if (key === 'publicKey') value = <AccountLink account={value} />
            return (
              <div>
                {key}: {value}
              </div>
            )
          })}
      </span>
    </Col>
  </Row>
)

Effect.propTypes = {
  compact: propTypes.bool,
  effect: propTypes.shape({
    id: propTypes.string.isRequired,
    links: propTypes.object.isRequired,
    sourceAccount: propTypes.string.isRequired,
    type: propTypes.string.isRequired,
  }).isRequired,
  effectURLFn: propTypes.func.isRequired,
}

export default Effect
