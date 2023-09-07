import { FormattedMessage } from 'react-intl'

const Unrecognized = ({ type }: { type: string }) => <FormattedMessage
  id="operation.unrecognized"
  values={{
    type: type,
  }}
/>

export default Unrecognized
