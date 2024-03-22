import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { useIntl } from 'react-intl'
import type { HorizonServerDetails } from '~/lib/stellar/server'
import HorizonServer, { requestToServerDetails } from '~/lib/stellar/server'

import { useLoaderData } from '@remix-run/react'

import LedgerTable from '../components/LedgerTable'
import Title from '../components/shared/TitleWithLink'
import TransactionTable from '../components/TransactionTable'

import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
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

export const loader = ({ request }: LoaderFunctionArgs) =>
  requestToServerDetails(request)

export default function Home() {
  const { formatMessage } = useIntl()
  const serverDetails = useLoaderData<typeof loader>() as HorizonServerDetails
  const [serverResponse, setServerResponse] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTitle('Home')

      const server = new HorizonServer(
        serverDetails.serverAddress,
        serverDetails.networkType as string,
      )
      Promise.all([
        ledgersRequest(server, { limit: LEDGER_RECORD_LIMIT }),
        transactionsRequest(server, { limit: TX_RECORD_LIMIT }),
        operationsRequest(server, { limit: OPERATION_RECORD_LIMIT }),
        server.serverURL.toString(),
      ]).then((response) => setServerResponse(response as any))
    }
  }, [])

  if (!serverResponse) {
    return
  }

  const [ledgers, transactions, operations, horizonURL] = serverResponse as any

  const viewAllStr = formatMessage({ id: 'view.all' })

  return (
    <Container id="home">
      <Row>
        <Col md={8}>
          <Card>
            <CardHeader>
              <PanelHeaderTitle
                title={formatMessage({ id: 'latest.operations' })}
                viewAllLabel={viewAllStr}
                viewAllLink="/operations"
              />
            </CardHeader>
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
            <CardHeader>
              <PanelHeaderTitle
                title={formatMessage({ id: 'latest.txs' })}
                viewAllLabel={viewAllStr}
                viewAllLink="/txs"
              />
            </CardHeader>
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
            <CardHeader>
              <PanelHeaderTitle
                title={formatMessage({ id: 'latest.ledgers' })}
                viewAllLabel={viewAllStr}
                viewAllLink="/ledgers"
              />
            </CardHeader>
            <Card.Body>
              <LedgerTable records={ledgers} compact />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
