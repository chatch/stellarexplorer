import React from 'react'

import Spinner from './Spinner'

function withMaybe(WrappedComponent, conditionalRenderingFn) {
    return class extends React.Component {
        render() {
            console.log(`withMaybe fn result: ${conditionalRenderingFn(this.props)}`)
            const spinner = conditionalRenderingFn(this.props)
                    ? <Spinner/>
                    : null
            return (
                <div>
                    <WrappedComponent { ...this.props }/>
                    {spinner}
                </div>
            )
        }
    }
}

export {
  withMaybe,
}
