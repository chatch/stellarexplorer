import PaymentTable from '~/components/PaymentTable'
import { accountTabComponent, accountTabLoader } from './lib/account-tab-base'

export const clientLoader = accountTabLoader()

export default accountTabComponent(PaymentTable, 'Payments', 'payments')
