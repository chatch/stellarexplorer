import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { networks } from '~/lib/stellar'
import HorizonServer, { defaultNetworkAddresses } from '~/lib/stellar/server'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import TransactionTable from '../components/TransactionTable'
import { setTitle } from '../lib/utils'

import { transactions } from '~/lib/stellar/server_request_utils'
import type { TransactionProps } from './tx.$txHash'

const RECORD_LIMIT = 20

export const loader = async () => {
  const server = new HorizonServer(
    networks.future,
    defaultNetworkAddresses.future
  )
  return transactions(server, RECORD_LIMIT).then(json)
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
