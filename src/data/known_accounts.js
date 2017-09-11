import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'

import anchors from './anchors'
import exchanges from './exchanges'

const knownAccounts = {}

Object.keys(anchors).forEach(anchorKey => {
  const anchor = anchors[anchorKey]
  Object.keys(anchor.currencies).forEach(code => {
    const currency = anchor.currencies[code]

    if (has(currency, 'issuer')) {
      knownAccounts[currency.issuer] = anchor
      knownAccounts[currency.issuer].name = anchorKey
    }

    if (has(currency, 'distributers') && currency.distributers.length > 0) {
      currency.distributers.forEach(distributer => {
        knownAccounts[distributer] = anchor
        knownAccounts[distributer].name = anchorKey
      })
    }
  })
})

Object.keys(exchanges).forEach(exchangeKey => {
  const exchange = exchanges[exchangeKey]
  if (!isEmpty(exchange.accounts)) {
    exchange.accounts.forEach(account => {
      knownAccounts[account] = exchange
      knownAccounts[account].name = exchangeKey
    })
  }
})

export default knownAccounts
