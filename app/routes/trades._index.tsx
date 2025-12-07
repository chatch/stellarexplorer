import { Card, Container, Row } from 'react-bootstrap'

import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLoaderData } from '@remix-run/react'

import type { TradeProps } from '../components/TradeTable'
import TradeTable from '../components/TradeTable'
import { setTitle } from '../lib/utils'

import { horizonRecordsLoader } from '~/lib/loader-util'
import Paging from '~/components/shared/Paging'

const RECORD_LIMIT = 20

export const clientLoader = horizonRecordsLoader<ReadonlyArray<TradeProps>>(
  'trades',
  RECORD_LIMIT,
)

export default function Trades() {
  const { records, cursor } = useLoaderData<typeof clientLoader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'trades' }))
  }, [formatMessage])

  return (
    <Container>
      <Row>
        <Card>
          <Card.Header>
            <FormattedMessage id="trades" />
          </Card.Header>
          <Card.Body>
            <Paging baseUrl="/trades" records={records} currentCursor={cursor}>
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
