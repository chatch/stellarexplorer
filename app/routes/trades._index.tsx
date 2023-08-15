import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLoaderData } from '@remix-run/react'

import type { TradeProps } from '../components/TradeTable'
import TradeTable from '../components/TradeTable'
import { setTitle } from '../lib/utils'

import { allRecordsWithPagingLoader } from '~/lib/loader-util'
import Paging from '~/components/shared/Paging'

const RECORD_LIMIT = 20

export const loader = allRecordsWithPagingLoader(`trades`, RECORD_LIMIT)

export default function Trades() {
  const { records, cursor }: {
    records: ReadonlyArray<TradeProps>,
    cursor?: string
  } = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  setTitle(formatMessage({ id: 'trades' }))

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="trades" />
          </CardHeader>
          <Card.Body>
            <Paging
              baseUrl='/trades'
              records={records}
              currentCursor={cursor}>
              <TradeTable
                records={records}
              // limit={20}
              />
            </Paging>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
