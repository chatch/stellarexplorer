import { accountTabComponent, accountTabLoader } from "./lib/account-tab-base"
import TradeTable from "~/components/TradeTable"

export const loader = accountTabLoader('trades')

export default accountTabComponent(TradeTable, 'Trades')

