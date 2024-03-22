import TransactionTable from '~/components/TransactionTable'
import { accountTabComponent, accountTabLoader } from './lib/account-tab-base'

export const loader = accountTabLoader()

export default accountTabComponent(
  TransactionTable,
  'Transactions',
  'transactions',
)
