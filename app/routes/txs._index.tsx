import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useLoaderData } from '@remix-run/react'

import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import TransactionTable from '../components/TransactionTable'
import { setTitle } from '../lib/utils'

import Paging from '~/components/shared/Paging'
import { getHorizonRecords } from '~/lib/loader-util'
import type { HorizonServerDetails } from '~/lib/stellar/server'
import { requestToServerDetails } from '~/lib/stellar/server'
import type { LoaderFunctionArgs } from '@remix-run/node'

const RECORD_LIMIT = 20

export const loader = ({ request }: LoaderFunctionArgs) =>
  requestToServerDetails(request)

export default function Transactions() {
  const serverDetails = useLoaderData<typeof loader>() as HorizonServerDetails

  const [records, setRecords] = useState(null)
  const [cursor, setCursor] = useState(null)

  useEffect(() => {
    setTitle('Transactions')
    getHorizonRecords(serverDetails, 'transactions', RECORD_LIMIT).then(
      (response) => {
        setRecords((response as any).records)
        setCursor((response as any).cursor)
      },
    )
  }, [])

  if (!records) {
    return
  }

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="transactions" />
          </CardHeader>
          <Card.Body>
            <Paging
              baseUrl="/txs"
              records={records as any}
              currentCursor={cursor as any}
            >
              <TransactionTable
                records={records as any}
                showLedger
                showSource
                compact={false}
              />
            </Paging>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
