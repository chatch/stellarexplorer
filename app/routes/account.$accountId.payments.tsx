import PaymentTable from '~/components/PaymentTable'
import { accountTabComponent, accountTabLoader } from './lib/account-tab-base'

export const loader = accountTabLoader('payments')

export default accountTabComponent(PaymentTable, 'Payments')
