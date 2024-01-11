import TradeTable from '~/components/TradeTable'
import { poolsTabComponent, poolTabLoader } from './lib/pool-tab-base'

export const loader = poolTabLoader('trades')

export default poolsTabComponent(TradeTable, 'Trades')
