import type { CentralizedExchange } from 'scripts/restructure-centralized-exchanges-json'
import centralizedJson from './centralized-exchanges-restructured.json'
export interface ExchangeProps {
  home: string
  accounts?: ReadonlyArray<string>
}

const convertCentralized = (
  exchanges: CentralizedExchange[],
): Record<string, ExchangeProps> => {
  const centralized: Record<string, ExchangeProps> = {}

  exchanges.forEach((exchange) => {
    const { address, domain, name } = exchange
    centralized[name] = {
      home: domain,
      accounts: [address],
    }
  })

  return centralized
}

const decentralized: Record<string, ExchangeProps> = {
  FireflyWallet: {
    home: 'wallet.fchain.io',
  },
  StellarX: {
    home: 'stellarx.com',
  },
  StellarTerm: {
    home: 'stellarterm.com',
  },
  Stellarport: {
    home: 'stellarport.io',
  },
  InterStellar: {
    home: 'interstellar.exchange',
  },
}

const centralized: Record<string, ExchangeProps> =
  convertCentralized(centralizedJson)

export { centralized, decentralized }
