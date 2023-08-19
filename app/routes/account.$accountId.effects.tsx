import { accountTabComponent, accountTabLoader } from "./lib/account-tab-base"
import EffectTable from "~/components/EffectTable"

export const loader = accountTabLoader('effects')

export default accountTabComponent(EffectTable, 'Effects')

