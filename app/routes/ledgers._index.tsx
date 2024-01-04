import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { FormattedMessage, useIntl } from 'react-intl'
import { useLoaderData } from '@remix-run/react'

import LedgerTable from '../components/LedgerTable'
import { setTitle } from '../lib/utils'

import type { LedgerProps } from './ledger.$ledgerId'
import Paging from '~/components/shared/Paging'
import { horizonRecordsLoader } from '~/lib/loader-util'
import { useEffect } from 'react'

const RECORD_LIMIT = 20

export const loader = horizonRecordsLoader<ReadonlyArray<LedgerProps>>(
  'ledgers',
  RECORD_LIMIT,
)

export default function Ledgers() {
  const { records, cursor } = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'ledgers' }))
  }, [formatMessage])

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="ledgers" />
          </CardHeader>
          <Card.Body>
            <Paging baseUrl="/ledgers" records={records} currentCursor={cursor}>
              <LedgerTable records={records} compact={false} />
            </Paging>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
