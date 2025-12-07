import { Card, Col, Container, Row } from 'react-bootstrap'
import { useIntl } from 'react-intl'
import type { HorizonServerDetails } from '~/lib/stellar/server'
import HorizonServer, { requestToServerDetails } from '~/lib/stellar/server'


import { json } from '~/lib/remix-shim'
import { useLoaderData } from '@remix-run/react'

import LedgerTable from '../components/LedgerTable'
import Title from '../components/shared/TitleWithLink'
import TransactionTable from '../components/TransactionTable'

import type { LoaderFunctionArgs, MetaFunction } from '~/lib/remix-shim'
import {
  ledgers as ledgersRequest,
  operations as operationsRequest,
  transactions as transactionsRequest,
} from '~/lib/stellar/server_request_utils'
import OperationTable from '~/components/OperationTable'
import { useEffect, useState } from 'react'
import { setTitle } from '~/lib/utils'

// App Metadata
export const meta: MetaFunction = () => {
  return [
    { title: 'Stellar Explorer' },
    {
      name: 'description',
      content:
        'Stellar Explorer - a ledger explorer for the Stellar network (https://stellar.org)',
    },
  ]
}

const PanelHeaderTitle = ({
  title,
  viewAllLabel,
  viewAllLink,
}: {
  title: string
  viewAllLabel: string
  viewAllLink: string
}) => (
  <Title
    rightLinkAddr={viewAllLink}
    rightLinkLabel={viewAllLabel}
    title={title}
  />
)

const TX_RECORD_LIMIT = 10
const LEDGER_RECORD_LIMIT = 10
const OPERATION_RECORD_LIMIT = 25

export const clientLoader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const details = await requestToServerDetails(request)
    return json(details)
  } catch (e) {
    throw e
  }
}

export default function Home() {
  const { formatMessage } = useIntl()
  const serverDetails = useLoaderData<typeof clientLoader>() as HorizonServerDetails
  const [serverResponse, setServerResponse] = useState(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTitle('Home')

      const server = new HorizonServer(
        serverDetails.serverAddress,
        serverDetails.networkType as string,
      )
      const fetchPromise = Promise.all([
        ledgersRequest(server, { limit: LEDGER_RECORD_LIMIT }),
        transactionsRequest(server, { limit: TX_RECORD_LIMIT }),
        operationsRequest(server, { limit: OPERATION_RECORD_LIMIT }),
        server.serverURL.toString(),
      ])

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 10000)
      )

      Promise.race([fetchPromise, timeoutPromise])
        .then((response) => setServerResponse(response as any))
        .catch((e) => {
          console.error("Failed to fetch data:", e)
          setError(e.message || "Unknown error occurred")
        })
    }
  }, [])

  if (error) {
    return (
      <Container className="mt-5">
        <h1 className="text-danger text-center">Error: {error}</h1>
      </Container>
    )
  }

  if (!serverResponse) {
    return (
      <Container className="mt-5">
        <h1 className="text-center text-dark">Loading data from Public Network...</h1>
      </Container>
    )
  }

  const [ledgers, transactions, operations, horizonURL] = serverResponse as any

  const viewAllStr = formatMessage({ id: 'view.all' })

  return (
    <Container id="home">
      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <PanelHeaderTitle
                title={formatMessage({ id: 'latest.operations' })}
                viewAllLabel={viewAllStr}
                viewAllLink="/operations"
              />
            </Card.Header>
            <Card.Body>
              <OperationTable
                compact
                records={operations}
                horizonURL={horizonURL}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <PanelHeaderTitle
                title={formatMessage({ id: 'latest.txs' })}
                viewAllLabel={viewAllStr}
                viewAllLink="/txs"
              />
            </Card.Header>
            <Card.Body>
              <TransactionTable
                compact
                records={transactions}
                showLedger
                showSource={false}
              />
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <PanelHeaderTitle
                title={formatMessage({ id: 'latest.ledgers' })}
                viewAllLabel={viewAllStr}
                viewAllLink="/ledgers"
              />
            </Card.Header>
            <Card.Body>
              <LedgerTable records={ledgers} compact />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}