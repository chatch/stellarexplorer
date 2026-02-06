import * as StellarSdk from '@stellar/stellar-sdk'
const pkg = StellarSdk.default || StellarSdk
const { SorobanServer, xdr } = pkg

import networks from './stellar/networks'
import Server from './stellar/server'

export { networks, Server, SorobanServer, xdr }
