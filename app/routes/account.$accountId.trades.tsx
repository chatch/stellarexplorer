import { accountTabComponent, accountTabLoader } from './lib/account-tab-base'
import TradeTable from '~/components/TradeTable'

export const loader = accountTabLoader()

export default accountTabComponent(TradeTable, 'Trades', 'trades')
