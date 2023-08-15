import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { requestToServer } from '~/lib/stellar/server'

import { LoaderArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import PaymentTable from '../components/PaymentTable'
import { setTitle } from '../lib/utils'

import { payments } from '~/lib/stellar/server_request_utils'
import type { PaymentProps } from '~/components/operations/Payment'

export const loader = ({ request }: LoaderArgs) => {
  const server = requestToServer(request)
  return payments(server).then(json)
}

export default function Payments() {
  const payments: ReadonlyArray<PaymentProps> = useLoaderData<typeof loader>()
  const { formatMessage } = useIntl()
  setTitle(formatMessage({ id: 'payments' }))
  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="payments" />
          </CardHeader>
          <Card.Body>
            <PaymentTable
              records={payments}
              // showPayment
              // showSource
              compact={false}
            // limit={20}
            />
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
