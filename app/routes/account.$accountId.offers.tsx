import OfferTable from "~/components/OfferTable"
import { accountTabLoader, accountTabComponent } from "./lib/account-tab-base"

export const loader = accountTabLoader('offers')

export default accountTabComponent(OfferTable, 'Offers')
