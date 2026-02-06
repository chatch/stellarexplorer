import TransactionsTable from '~/components/TransactionTable'
import { poolsTabComponent, poolTabLoader } from './lib/pool-tab-base'

export const clientLoader = poolTabLoader('transactions')

export default poolsTabComponent(TransactionsTable, 'Transactions')
