import OfferTable from '~/components/OfferTable'
import { accountTabLoader, accountTabComponent } from './lib/account-tab-base'

export const clientLoader = accountTabLoader()

export default accountTabComponent(OfferTable, 'Offers', 'offers')
