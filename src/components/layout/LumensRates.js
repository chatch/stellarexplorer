import React from 'react'
import 'whatwg-fetch'

const FEED_URL = 'https://api.coinmarketcap.com/v1/ticker/stellar/'

class LumensRates extends React.Component {
  componentDidMount() {
    fetch(FEED_URL).then((rsp) => rsp.json()).then((rspJson) => {
      const lumens = rspJson[0]
      const newState = {
        usd: lumens.price_usd,
        btc: lumens.price_btc,
        change: lumens.percent_change_24h
      }
      this.setState(newState)
    }).catch((err) => console.error(`Failed to fetch price: [${err}]`))
  }

  render() {
    if (this.state === null)
      return null
    return (
      <div>
        <span>USD: {this.state.usd}</span>
        |
        <span>BTC: {this.state.btc}</span>
        |
        <span>Change 24hrs: {this.state.change}</span>
      </div>
    )
  }
}

export default LumensRates
