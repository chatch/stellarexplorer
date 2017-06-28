import React from 'react'
import PropTypes from 'prop-types'
import {FormattedRelative} from 'react-intl'
import {withServer} from './HOCs'

const TransactionTime = ({time}) => <FormattedRelative value={time} />

class TransactionTimeContainer extends React.Component {
  state = {}

  componentDidMount() {
    this.props.server
      .transactions()
      .transaction(this.props.id)
      .call()
      .then(rsp => {
        this.setState({time: rsp.created_at})
      })
  }

  render() {
    if (!this.state.time) return null
    return <TransactionTime time={this.state.time} />
  }
}

TransactionTimeContainer.propTypes = {
  id: PropTypes.string.isRequired,
}

export default withServer(TransactionTimeContainer)
