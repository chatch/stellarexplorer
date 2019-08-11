import has from 'lodash/has'
import PropTypes from 'prop-types'

import distributers from './distributers'
import {
  centralized as centralizedExchanges,
  decentralized as decentralizedExchanges,
} from './exchanges.json'
import inflationPools from './inflation_pools'
import directory from './directory'
const {anchors, destinations} = directory

/**
 * Produces a lookup of all known accounts keyed on the Stellar public address.
 */

const KnownAccountPropTypes = Object.freeze({
  name: PropTypes.string,
  logo: PropTypes.string,
  type: PropTypes.oneOf([
    'issuer',
    'destination',
    'distributer',
    'exchange',
    'inflation_pool',
  ]).isRequired,
  website: PropTypes.string,
})

// Add all anchor issuing accounts
const addAnchors = (accounts, anchors) => {
  Object.keys(anchors).forEach(domain => {
    const anchor = anchors[domain]
    Object.keys(anchor.assets).forEach(code => {
      const asset = anchor.assets[code]
      const issuer = asset.substring(asset.indexOf('-') + 1)
      accounts[issuer] = anchor
      accounts[issuer].name = anchor.displayName
      accounts[issuer].type = 'issuer'
      accounts[issuer].logo = domain
    })
  })
}

// Add all known destinations in directory (this includes exchanges trading addresses)
const addDestinations = (accounts, destinations) => {
  Object.keys(destinations).forEach(addr => {
    // if not already added
    if (!has(accounts, addr))
      accounts[addr] = {name: destinations[addr].name, type: 'destination'}
  })
}

// Add from local exchanges list also which adds some extra info
const addExchanges = (accounts, exchanges) => {
  Object.keys(exchanges).forEach(name => {
    const exchange = exchanges[name]
    if (exchange.accounts && exchange.accounts.length > 0) {
      exchange.accounts.forEach(addr => {
        // if exchange address not already in known accounts list
        if (!has(accounts, addr)) {
          accounts[addr] = {name, type: 'exchange'}
        }

        // override name with displayName defined in exchanges directory
        if (has(exchange, 'displayName'))
          accounts[addr].name = exchange.displayName

        if (!has(accounts[addr], 'website'))
          accounts[addr].website = exchange.home

        if (!has(accounts[addr], 'logo')) accounts[addr].logo = accounts[addr].name.toLowerCase()
      })
    }
  })
}

// precond: anchors already added to accounts
const addDistributers = (accounts, distributers) => {
  Object.keys(distributers).forEach(addr => {
    const issuer = accounts[distributers[addr]]
    if (!issuer) throw new Error(`issuer for distributer [${addr}] not found`)
    accounts[addr] = issuer
    accounts[addr].type = 'distributer'
  })
}

const addInflationPools = (accounts, pools) => {
  Object.keys(pools).forEach(addr => {
    accounts[addr] = pools[addr]
    accounts[addr].type = 'inflation_pool'
  })
}

const validateRecords = accounts => {
  Object.keys(accounts).forEach(addr =>
    PropTypes.checkPropTypes(
      KnownAccountPropTypes,
      accounts[addr],
      'prop',
      'KnownAccount'
    )
  )
}

const knownAccounts = {}

addAnchors(knownAccounts, anchors)
addExchanges(knownAccounts, centralizedExchanges)
addExchanges(knownAccounts, decentralizedExchanges)
addDistributers(knownAccounts, distributers)
addInflationPools(knownAccounts, inflationPools)
addDestinations(knownAccounts, destinations)

validateRecords(knownAccounts)

export default knownAccounts
