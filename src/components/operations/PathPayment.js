import React from 'react'
import Payment from './Payment'

class PathPayment extends React.Component {
    render() {
        const d = this.props.data
        console.log(`DATA: [${Object.keys(this.props.data)}]`)
        return (
            <Payment data={d}>
                <div>Source Asset Code {d.source_asset_code}</div>
                <div>Source Asset Issuer {d.source_asset_issuer}</div>
                <div>Source Asset Type {d.source_asset_type}</div>
                <div>Source Max {d.source_max}</div>
            </Payment>
        )
    }
}

export default PathPayment
