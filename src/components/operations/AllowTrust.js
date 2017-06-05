import React from 'react'
import Trust from './Trust'

class AllowTrust extends React.Component {
  render() {
    const d = this.props.data
    return (
      <Trust data={d}>
        <div>Authorize {d.authorize}</div>
      </Trust>
    )
  }
}

export default AllowTrust
