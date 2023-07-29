import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { useIntl } from 'react-intl'
import { networks } from '~/lib/stellar'
import HorizonServer, { defaultNetworkAddresses } from '~/lib/stellar/server'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import LedgerTable from '../components/LedgerTable'
import Title from '../components/shared/TitleWithLink'
import TransactionTable from '../components/TransactionTable'

import type { V2_MetaFunction } from '@remix-run/node'
import { ledgers, operations, transactions } from '~/lib/stellar/server_request_utils'
import type { OperationTableProps } from '~/components/OperationTable'
import OperationTable from '~/components/OperationTable'
import type { LedgerProps } from './ledger.$ledgerId'
import type { TransactionProps } from './tx.$txHash'

// App Metadata
export const meta: V2_MetaFunction = () => {
  return [
    { title: "Stellar Explorer" },
    { name: "description", content: "Stellar Explorer - a ledger explorer for the Stellar network (https://stellar.org)" },
  ]
}

const PanelHeaderTitle = ({ title, viewAllLabel, viewAllLink }: {
  title: string, viewAllLabel: string, viewAllLink: string
}
) => (
  <Title
    rightLinkAddr={viewAllLink}
    rightLinkLabel={viewAllLabel}
    title={title}
  />
)

const TX_RECORD_LIMIT = 10
const LEDGER_RECORD_LIMIT = 10
const OPERATION_RECORD_LIMIT = 25

export const loader = async () => {
  const server = new HorizonServer(
    networks.future,
    defaultNetworkAddresses.future
  )
  return Promise.all([
    ledgers(server, LEDGER_RECORD_LIMIT),
    transactions(server, TX_RECORD_LIMIT),
    operations({ server, limit: OPERATION_RECORD_LIMIT }),
  ]).then(result =>
    json({
      ledgers: result[0],
      transactions: result[1],
      operations: result[2]
    })
  )
}

export default function Home() {
  const { formatMessage } = useIntl()
  const {
    ledgers,
    transactions,
    operations
  }: {
    ledgers: ReadonlyArray<LedgerProps>,
    transactions: ReadonlyArray<TransactionProps>,
    operations: ReadonlyArray<OperationTableProps>
  } = useLoaderData<typeof loader>()

  // setTitle('Home')
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
              <LedgerTable
                records={ledgers}
                compact />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}