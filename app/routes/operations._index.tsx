import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { FormattedMessage, useIntl } from 'react-intl'
import { useLoaderData } from '@remix-run/react'

import OperationTable from '../components/OperationTable'
import { setTitle } from '../lib/utils'

import { horizonRecordsLoader } from '~/lib/loader-util'
import Paging from '~/components/shared/Paging'
import { useEffect } from 'react'

const RECORD_LIMIT = 30

export const loader = horizonRecordsLoader<ReadonlyArray<any>>(
  'operations',
  RECORD_LIMIT,
)

export default function Operations() {
  const { records, cursor, horizonURL } = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'operations' }))
  }, [formatMessage])

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="operations" />
          </CardHeader>
          <Card.Body>
            <Paging
              baseUrl="/operations"
              records={records}
              currentCursor={cursor}
            >
              <OperationTable
                records={records}
                compact={false}
                horizonURL={horizonURL}
              />
            </Paging>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
