import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'

import { FormattedMessage, useIntl } from 'react-intl'
import { Await, useLoaderData } from '@remix-run/react'

import LedgerTable from '../components/LedgerTable'
import { setTitle } from '../lib/utils'

import type { LedgerProps } from './ledger.$ledgerId'
import Paging from '~/components/shared/Paging'
import { horizonRecordsLoaderWithDefer } from '~/lib/loader-util'
import { Suspense, useEffect } from 'react'

const RECORD_LIMIT = 20

export const loader = horizonRecordsLoaderWithDefer<ReadonlyArray<LedgerProps>>(`ledgers`, RECORD_LIMIT)

export default function Ledgers() {
  const { response } = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'ledgers' }))
  }, [])

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="ledgers" />
          </CardHeader>
          <Card.Body>
            <Suspense
              fallback={<Spinner />}
            >
              <Await
                resolve={response}
                errorElement={
                  <p>Error loading data</p>
                }
              >
                {({ records, cursor }) =>
                  <Paging
                    baseUrl='/ledgers'
                    records={records}
                    currentCursor={cursor}>
                    <LedgerTable
                      records={records}
                      compact={false}
                    />
                  </Paging>
                }
              </Await>
            </Suspense>
          </Card.Body>
        </Card>
      </Row>
    </Container >
  )
}
