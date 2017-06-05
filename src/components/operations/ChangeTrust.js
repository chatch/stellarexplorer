import React from 'react'
import Trust from './Trust'

class ChangeTrust extends React.Component {
  render() {
    const d = this.props.data
    return (
      <Trust data={d}>
        <div>Limit {d.limit}</div>
      </Trust>
    )
  }
}

export default ChangeTrust
