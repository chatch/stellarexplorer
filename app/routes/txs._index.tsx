import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLoaderData } from '@remix-run/react'

import TransactionTable from '../components/TransactionTable'
import { setTitle } from '../lib/utils'

import type { TransactionProps } from './tx.$txHash'
import Paging from '~/components/shared/Paging'
import { allRecordsWithPagingLoader } from '~/lib/loader-util'

const RECORD_LIMIT = 20

export const loader = allRecordsWithPagingLoader(`transactions`, RECORD_LIMIT)

export default function Transactions() {
  const { records, cursor }: {
    records: ReadonlyArray<TransactionProps>,
    cursor?: string
  } = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  setTitle(formatMessage({ id: 'transactions' }))

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="transactions" />
          </CardHeader>
          <Card.Body>
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
          </Card.Body>
        </Card>
      </Row>
    </Container >
  )
}
