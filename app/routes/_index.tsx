import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { useIntl } from 'react-intl'
import { requestToServer } from '~/lib/stellar/server'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import LedgerTable from '../components/LedgerTable'
import Title from '../components/shared/TitleWithLink'
import TransactionTable from '../components/TransactionTable'

import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import {
  ledgers,
  operations,
  transactions,
} from '~/lib/stellar/server_request_utils'
import type { OperationTableProps } from '~/components/OperationTable'
import OperationTable from '~/components/OperationTable'
import type { LedgerProps } from './ledger.$ledgerId'
import type { TransactionProps } from './tx.$txHash'
import { useEffect } from 'react'
import { setTitle } from '~/lib/utils'

// App Metadata
export const meta: V2_MetaFunction = () => {
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

export const loader = async ({ request }: LoaderArgs) => {
  const server = await requestToServer(request)
  return Promise.all([
    ledgers(server, { limit: LEDGER_RECORD_LIMIT }),
    transactions(server, { limit: TX_RECORD_LIMIT }),
    operations(server, { limit: OPERATION_RECORD_LIMIT }),
    server.serverURL.toString(),
  ]).then((result) =>
    json({
      ledgers: result[0],
      transactions: result[1],
      operations: result[2],
      horizonURL: result[3],
    }),
  )
}

export default function Home() {
  const {
    ledgers,
    transactions,
    operations,
    horizonURL,
  }: {
    ledgers: ReadonlyArray<LedgerProps>
    transactions: ReadonlyArray<TransactionProps>
    operations: ReadonlyArray<OperationTableProps>
    horizonURL?: string
  } = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle('Home')
  }, [])

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
