import { accountTabLoader } from './lib/account-tab-base'
import { nameValueAccountTab } from './lib/name-value-table'

export const clientLoader = accountTabLoader()

export default nameValueAccountTab('Flags')
