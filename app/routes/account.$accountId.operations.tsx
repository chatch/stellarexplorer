import { accountTabComponent, accountTabLoader } from './lib/account-tab-base'
import OperationTable from '~/components/OperationTable'

export const clientLoader = accountTabLoader()

export default accountTabComponent(OperationTable, 'Operations', 'operations')
