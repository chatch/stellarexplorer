import type { TrustProps } from './Trust'
import Trust from './Trust'
import { FormattedMessage } from 'react-intl'

interface ChangeTrustProps extends TrustProps {
  limit: number
}

const ChangeTrust = (props: ChangeTrustProps) => (
  <Trust {...props}>
    <FormattedMessage
      id="operation.trust.change"
      values={{
        limit: props.limit,
      }}
    />
  </Trust>
)

export default ChangeTrust
