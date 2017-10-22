import has from 'lodash/has'
import directory from './directory'
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
    knownAccounts[issuer].img = anchor.logo
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

export default knownAccounts
