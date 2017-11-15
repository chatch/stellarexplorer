import has from 'lodash/has'
import directory from './directory'
import exchanges from './exchanges'
const {anchors, destinations} = directory

const knownAccounts = {}

// Add all anchor issuing accounts
Object.keys(anchors).forEach(domain => {
  const anchor = anchors[domain]
  Object.keys(anchor.assets).forEach(code => {
    const asset = anchor.assets[code]
    const issuer = asset.substring(asset.indexOf('-') + 1)
    knownAccounts[issuer] = anchor
    knownAccounts[issuer].logo = anchor.logo
    knownAccounts[issuer].name = anchor.displayName
    knownAccounts[issuer].type = 'issuer'
  })
})

// Add all known destinations (includes exchanges trading addresses)
Object.keys(destinations).forEach(addr => {
  knownAccounts[addr] = {name: destinations[addr].name, type: 'destination'}
})

// Add from local exchanges list also which adds some extra info)
Object.keys(exchanges).forEach(name => {
  const exchange = exchanges[name]
  if (exchange.accounts && exchange.accounts.length > 0) {
    exchange.accounts.forEach(addr => {
      if (!has(knownAccounts, addr)) {
        knownAccounts[addr] = {name: name, type: 'exchange'}
      }
      if (!has(knownAccounts[addr], 'website'))
        knownAccounts[addr].website = exchange.home
      if (!has(knownAccounts[addr], 'logo'))
        knownAccounts[addr].logo = exchange.logo
    })
  }
})

export default knownAccounts
