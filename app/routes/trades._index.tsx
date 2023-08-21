import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { Await, useLoaderData } from '@remix-run/react'

import type { TradeProps } from '../components/TradeTable'
import TradeTable from '../components/TradeTable'
import { setTitle } from '../lib/utils'

import { horizonRecordsLoaderWithDefer } from '~/lib/loader-util'
import Paging from '~/components/shared/Paging'
import { Suspense, useEffect } from 'react'

const RECORD_LIMIT = 20

export const loader = horizonRecordsLoaderWithDefer<ReadonlyArray<TradeProps>>(`trades`, RECORD_LIMIT)

export default function Trades() {
  const { response } = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'trades' }))
  }, [])

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="trades" />
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
                    baseUrl='/trades'
                    records={records}
                    currentCursor={cursor}>
                    <TradeTable
                      records={records}
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
