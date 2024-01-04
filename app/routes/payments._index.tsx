import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLoaderData } from '@remix-run/react'

import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import PaymentTable from '../components/PaymentTable'
import { setTitle } from '../lib/utils'

import type { PaymentProps } from '~/components/operations/Payment'
import { horizonRecordsLoader } from '~/lib/loader-util'
import Paging from '~/components/shared/Paging'

export const loader = horizonRecordsLoader<ReadonlyArray<PaymentProps>>(
  'payments',
  30,
)

export default function Payments() {
  const { records, cursor, horizonURL } = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'payments' }))
  }, [formatMessage])

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="payments" />
          </CardHeader>
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
