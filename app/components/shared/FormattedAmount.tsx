import { formatAmount } from '../../lib/utils'

// chop off any trailing 0s
const FormattedAmount = ({ amount }: { amount: string }) => (
  <>{formatAmount(amount)}</>
)

export default FormattedAmount
