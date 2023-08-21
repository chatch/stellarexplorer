import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { Await, useLoaderData } from '@remix-run/react'

import PaymentTable from '../components/PaymentTable'
import { setTitle } from '../lib/utils'

import type { PaymentProps } from '~/components/operations/Payment'
import { horizonRecordsLoaderWithDefer } from '~/lib/loader-util'
import Paging from '~/components/shared/Paging'
import { Suspense, useEffect } from 'react'

export const loader = horizonRecordsLoaderWithDefer<ReadonlyArray<PaymentProps>>(`payments`, 30)

export default function Payments() {
  const { response } = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'payments' }))
  }, [])

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="payments" />
          </CardHeader>
          <Card.Body>
            <Suspense
              fallback={<p>Loading ...</p>}
            >
              <Await
                resolve={response}
                errorElement={
                  <p>Error loading data</p>
                }
              >
                {({ records, cursor }) =>
                  <Paging
                    baseUrl='/payments'
                    records={records}
                    currentCursor={cursor}>
                    <PaymentTable
                      records={records}
                      // showPayment
                      // showSource
                      compact={false}
                    // limit={20}
                    />
                  </Paging>
                }
              </Await>
            </Suspense>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
