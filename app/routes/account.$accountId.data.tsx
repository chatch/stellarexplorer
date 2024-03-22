import { accountTabLoader } from './lib/account-tab-base'
import { nameValueAccountTab } from './lib/name-value-table'

export const loader = accountTabLoader()

export default nameValueAccountTab('Data')
