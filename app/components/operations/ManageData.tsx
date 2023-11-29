import { FormattedMessage } from 'react-intl'
import truncate from 'lodash/truncate'
import { base64Decode } from '../../lib/utils'

const MSG_KEY_PREFIX = 'operation.manage.data'

export interface ManageDataProps {
  name: string
  value: string
}

const ManageData = ({ name, value }: ManageDataProps) => {
  const isRemove = value === ''
  return (
    <span>
      <FormattedMessage
        id={`${MSG_KEY_PREFIX}.${isRemove ? 'remove' : 'set'}`}
        values={{
          name: truncate(name),
        }}
      />
      {!isRemove && (
        <FormattedMessage
          id={`${MSG_KEY_PREFIX}.set.to`}
          values={{
            value: truncate(base64Decode(value)),
          }}
        />
      )}
    </span>
  )
}

export default ManageData
