import OperationTable from '~/components/OperationTable'
import { poolsTabComponent, poolTabLoader } from './lib/pool-tab-base'

export const clientLoader = poolTabLoader('operations')

export default poolsTabComponent(OperationTable, 'Operations')
