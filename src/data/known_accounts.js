import {anchors, destinations} from 'stellarterm-directory'

const knownAccounts = {}

// Add all anchor issuing accounts
Object.keys(anchors).forEach(domain => {
  const anchor = anchors[domain]
  Object.keys(anchor.assets).forEach(code => {
    const asset = anchor.assets[code]
    const issuer = asset.substring(asset.indexOf('-') + 1)
    knownAccounts[issuer] = anchor
    knownAccounts[issuer].img = anchor.logo
    knownAccounts[issuer].type = 'issuer'
  })
})

// Add all known destinations (includes exchanges trading addresses)
Object.keys(destinations).forEach(addr => {
  knownAccounts[addr] = {name: destinations[addr].name, type: 'destination'}
})

export default knownAccounts
