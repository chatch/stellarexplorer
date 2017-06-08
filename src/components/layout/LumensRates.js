import React from 'react'
import 'whatwg-fetch'

const FEED_URL = 'https://api.coinmarketcap.com/v1/ticker/stellar/'

class LumensRatesContainer extends React.Component {
  componentDidMount() {
    fetch(FEED_URL).then((rsp) => rsp.json()).then((rspJson) => {
      const lumens = rspJson[0]
      const newState = {
        btc: lumens.price_btc,
        change: lumens.percent_change_24h,
        usd: lumens.price_usd
      }
      this.setState(newState)
    }).catch((err) => {
      console.error(`Failed to fetch price: [${err}]`)
    })
  }
  render() {
    if (!this.state)
      return null
    return <LumensRates {...this.state}/>
  }
}

class LumensRates extends React.Component {
  isPositive(changeNumStr) {
    const asFloat = Number.parseFloat(changeNumStr)
    return (Number.isNaN(asFloat) === false && Number(asFloat) >= 0)
  }

  renderChange(change) {
    const positive = this.isPositive(change)
    const valueStr = `${ (positive)
      ? '+'
      : '-'}${this.props.change}%`
    const style = {
      color: (positive)
        ? 'green'
        : 'red'
    }
    return <span>Change (24hrs):&nbsp;
      <span style={style}>{valueStr}</span>
    </span>
  }

  render() {
    return (
      <div>
        <span>USD: {this.props.usd}</span>
        &nbsp;|&nbsp;
        <span>BTC: {this.props.btc}</span>
        &nbsp;|&nbsp; {this.renderChange(this.props.change)}
      </div>
    )
  }
}

export default LumensRatesContainer
