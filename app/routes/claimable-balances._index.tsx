import { useEffect } from 'react'
import { useIntl } from 'react-intl'

import { setTitle } from '../lib/utils'

export default function ClaimableBalances() {
  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'claimable-balances' }))
  }, [formatMessage])
}
