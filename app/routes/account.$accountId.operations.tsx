import { accountTabComponent, accountTabLoader } from './lib/account-tab-base'
import OperationTable from '~/components/OperationTable'

export const loader = accountTabLoader('operations')

export default accountTabComponent(OperationTable, 'Operations')
