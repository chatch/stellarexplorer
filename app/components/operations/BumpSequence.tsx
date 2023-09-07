import { FormattedMessage } from 'react-intl'

const BumpSequence = ({ bumpTo }: { bumpTo: number }) => (
  <FormattedMessage
    id="operation.bump"
    values={{
      sequence: String(bumpTo),
    }}
  />
)

export default BumpSequence
