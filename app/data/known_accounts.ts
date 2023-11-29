import has from 'lodash/has'

import distributers from './distributers'
import type { ExchangeProps } from './exchanges'
import {
  centralized as centralizedExchanges,
  decentralized as decentralizedExchanges,
} from './exchanges'
import type { InflationProps } from './inflation_pools'
import inflationPools from './inflation_pools'
import type { DirectoryAnchor, DirectoryDestination } from './directory'
import directory from './directory'

/**
 * Produces a lookup of all known accounts keyed on the Stellar public address.
 */

export type KnownAccountType =
  | 'issuer'
  | 'destination'
  | 'distributer'
  | 'exchange'
  | 'inflation_pool'
  | 'anchor'

export interface KnownAccountProps {
  name: string
  type: KnownAccountType
  logo?: string
  website?: string
}

// Add all anchor issuing accounts
const addAnchors = (
  accounts: Record<string, KnownAccountProps>,
  anchors: Record<string, DirectoryAnchor>,
) =>
  Object.keys(anchors).forEach((domain) => {
    const anchor = anchors[domain]
    Object.keys(anchor.assets).forEach((code) => {
      const asset = anchor.assets[code]
      const issuer = asset.substring(asset.indexOf('-') + 1)
      accounts[issuer] = {
        ...anchor,
        name: anchor.displayName,
        type: 'issuer',
        logo: domain,
      }
    })
  })

// Add all known destinations in directory (this includes exchanges trading addresses)
const addDestinations = (
  accounts: Record<string, KnownAccountProps>,
  destinations: Record<string, DirectoryDestination>,
) =>
  Object.keys(destinations).forEach((addr) => {
    // if not already added
    if (!has(accounts, addr))
      accounts[addr] = {
        name: destinations[addr].name,
        type: 'destination',
      }
  })

// Add from local exchanges list also which adds some extra info
const addExchanges = (
  accounts: Record<string, KnownAccountProps>,
  exchanges: Record<string, ExchangeProps>,
) =>
  Object.keys(exchanges).forEach((name) => {
    const exchange = exchanges[name]
    if (exchange.accounts && exchange.accounts.length > 0) {
      exchange.accounts.forEach((addr: string) => {
        // if exchange address not already in known accounts list
        if (!has(accounts, addr)) {
          accounts[addr] = { name, type: 'exchange' }
        }

        if (!has(accounts[addr], 'website'))
          accounts[addr].website = exchange.home

        if (!has(accounts[addr], 'logo'))
          accounts[addr].logo = accounts[addr].name.toLowerCase()
      })
    }
  })

// precond: anchors already added to accounts
const addDistributers = (
  accounts: Record<string, KnownAccountProps>,
  distributers: Record<string, string>,
) =>
  Object.keys(distributers).forEach((addr) => {
    const issuer = accounts[distributers[addr]]
    if (!issuer) throw new Error(`issuer for distributer [${addr}] not found`)
    accounts[addr] = issuer
    accounts[addr].type = 'distributer'
  })

const addInflationPools = (
  accounts: Record<string, KnownAccountProps>,
  pools: Record<string, InflationProps>,
) => {
  Object.keys(pools).forEach((addr) => {
    accounts[addr] = {
      name: pools[addr].name,
      website: pools[addr].website,
      type: 'inflation_pool',
    }
  })
}

const knownAccounts: Record<string, KnownAccountProps> = {}

addAnchors(knownAccounts, directory.anchors)
addExchanges(knownAccounts, centralizedExchanges)
addExchanges(knownAccounts, decentralizedExchanges)
addDistributers(knownAccounts, distributers)
addInflationPools(knownAccounts, inflationPools)
addDestinations(knownAccounts, directory.destinations)

export default knownAccounts
