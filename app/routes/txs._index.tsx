import { Suspense, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Await, useLoaderData } from '@remix-run/react'

import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'

import TransactionTable from '../components/TransactionTable'
import { setTitle } from '../lib/utils'

import type { TransactionProps } from './tx.$txHash'
import Paging from '~/components/shared/Paging'
import { horizonRecordsLoaderWithDefer } from '~/lib/loader-util'

const RECORD_LIMIT = 20

export const loader = horizonRecordsLoaderWithDefer<ReadonlyArray<TransactionProps>>(`transactions`, RECORD_LIMIT)

export default function Transactions() {
  const { response } = useLoaderData<typeof loader>()

  useEffect(() => {
    setTitle(`Transactions`)
  }, [])

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="transactions" />
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
                    baseUrl='/txs'
                    records={records}
                    currentCursor={cursor}>
                    <TransactionTable
                      records={records}
                      showLedger
                      showSource
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
