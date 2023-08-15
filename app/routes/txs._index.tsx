import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { requestToServer } from '~/lib/stellar/server'

import { LoaderArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import TransactionTable from '../components/TransactionTable'
import { setTitle } from '../lib/utils'

import { transactions } from '~/lib/stellar/server_request_utils'
import type { TransactionProps } from './tx.$txHash'

const RECORD_LIMIT = 20

export const loader = ({ request }: LoaderArgs) => {
  const server = requestToServer(request)
  return transactions(server, undefined, RECORD_LIMIT).then(json)
}

export default function Transactions() {
  const transactions: ReadonlyArray<TransactionProps> = useLoaderData<typeof loader>()
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
            <TransactionTable
              records={transactions}
              showLedger
              showSource
              compact={false}
            />
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
