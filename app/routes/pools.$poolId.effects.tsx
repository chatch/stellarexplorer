import EffectTable from '~/components/EffectTable'
import { poolsTabComponent, poolTabLoader } from './lib/pool-tab-base'

export const loader = poolTabLoader('effects')

export default poolsTabComponent(EffectTable, 'Effects')
