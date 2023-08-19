import OperationTable from "~/components/OperationTable"
import { accountTabLoader, accountTabComponent } from "./lib/account-tab-base"

export const loader = accountTabLoader('offers')

export default accountTabComponent(OperationTable, 'Offers')
