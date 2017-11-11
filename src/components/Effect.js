import React from 'react'
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
import {FormattedRelative} from 'react-intl'
import propTypes from 'prop-types'

import AccountLink from './shared/AccountLink'
import TransactionHash from './shared/TransactionHash'

const effectBaseProps = [
  'id',
  'account',
  'type',
  'typeI',
  'links',
  'pagingToken',
]

class Effect extends React.Component {
  state = {}

  componentDidMount() {
    this.props.effect
      .operation()
      .then(op => op.transaction())
      .then(tx => this.setState({tx: tx}))
  }

  render() {
    const tx = this.state.tx
    if (!tx) return null
    const {effect} = this.props
    return (
      <Row key={effect.id} className="effect">
        <Col md={3}>{effect.type}</Col>
        <Col md={5}>
          <span>
            {Object.keys(effect)
              .filter(key => effectBaseProps.indexOf(key) === -1)
              .filter(key => typeof effect[key] !== 'function')
              .map(key => {
                let value = effect[key]
                if (value === '') value = '<empty>'

                if (key === 'publicKey' || key === 'assetIssuer')
                  value = <AccountLink account={value} />
                else if (key === 'homeDomain') value = <a href={key}>{value}</a>

                return (
                  <div key={key}>
                    {key}: {value}
                  </div>
                )
              })}
          </span>
        </Col>
        <Col md={2}>
          <FormattedRelative value={this.state.tx.created_at} />
        </Col>
        <Col md={2}>
          <TransactionHash hash={this.state.tx.hash} compact={true} />
        </Col>
      </Row>
    )
  }
}
Effect.propTypes = {
  compact: propTypes.bool,
  effect: propTypes.shape({
    id: propTypes.string.isRequired,
    links: propTypes.object.isRequired,
    account: propTypes.string.isRequired,
    type: propTypes.string.isRequired,
  }).isRequired,
  effectURLFn: propTypes.func.isRequired,
}

export default Effect
