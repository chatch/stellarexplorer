import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLoaderData } from '@remix-run/react'

import { Card, Container, Row } from 'react-bootstrap'

import PaymentTable from '../components/PaymentTable'
import { setTitle } from '../lib/utils'

import type { PaymentProps } from '~/components/operations/Payment'
import { horizonRecordsLoader } from '~/lib/loader-util'
import Paging from '~/components/shared/Paging'

export const clientLoader = horizonRecordsLoader<ReadonlyArray<PaymentProps>>(
  'payments',
  30,
)

export default function Payments() {
  const { records, cursor, horizonURL } = useLoaderData<typeof clientLoader>() as any

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'payments' }))
  }, [formatMessage])

  return (
    <Container>
      <Row>
        <Card>
          <Card.Header>
            <FormattedMessage id="payments" />
          </Card.Header>
          <Card.Body>
            <Paging
              baseUrl="/payments"
              records={records}
              currentCursor={cursor}
            >
              <PaymentTable
                records={records}
                // showPayment
                // showSource
                compact={false}
                horizonURL={horizonURL}
              // limit={20}
              />
            </Paging>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}