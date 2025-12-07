import TradeTable from '~/components/TradeTable'
import { poolsTabComponent, poolTabLoader } from './lib/pool-tab-base'

export const clientLoader = poolTabLoader('trades')

export default poolsTabComponent(TradeTable, 'Trades')
