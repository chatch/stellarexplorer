import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { networks } from '~/lib/stellar'
import HorizonServer, { defaultNetworkAddresses } from '~/lib/stellar/server'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import type { TradeProps } from '../components/TradeTable'
import TradeTable from '../components/TradeTable'
import { setTitle } from '../lib/utils'

import { trades } from '~/lib/stellar/server_request_utils'

export const loader = async () => {
  const server = new HorizonServer(
    networks.future,
    defaultNetworkAddresses.future
  )
  return trades(server).then(json)
}

export default function Trades() {
  const trades: ReadonlyArray<TradeProps> = useLoaderData<typeof loader>()
  const { formatMessage } = useIntl()
  setTitle(formatMessage({ id: 'trades' }))
  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="trades" />
          </CardHeader>
          <Card.Body>
            <TradeTable
              records={trades}
            // limit={20}
            />
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
