import has from 'lodash/has'
import directory from './directory'
import exchanges from './exchanges'
const {anchors, destinations} = directory

// TODO: remove this if PR https://github.com/irisli/stellarterm/pull/91
// is merged as it adds display names to the directory
const anchorDisplayNames = {
  'naobtc.com': 'NaoBTC',
  'tempo.eu.com': 'TEMPO',
  'ripplefox.com': 'RippleFox',
  'coins.asia': 'coins.asia',
  'vcbear.net': 'VCBear',
  'tonaira.com': 'Tonaira',
  'apay.io': 'apay.io',
  'btc.papayame.com': 'apay.io', // remove when removed from directory
  'ltc.papayame.com': 'apay.io', // remove when removed from directory
  'gft.network': 'GFT',
  'collective21.org': 'Collective21',
  'liquido.i-server.org': 'Liquido',
  'equid.co': 'eQuid',
  'moni.com': 'MONI',
  'bitcoinfundi.com': 'Golix',
  'cryptomover.com': 'Cryptomover',
  'mobius.network': 'Mobius',
}

const knownAccounts = {}

// Add all anchor issuing accounts
Object.keys(anchors).forEach(domain => {
  const anchor = anchors[domain]
  Object.keys(anchor.assets).forEach(code => {
    const asset = anchor.assets[code]
    const issuer = asset.substring(asset.indexOf('-') + 1)
    knownAccounts[issuer] = anchor
    knownAccounts[issuer].logo = anchor.logo
    knownAccounts[issuer].name = has(anchorDisplayNames, domain)
      ? anchorDisplayNames[domain]
      : domain
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
