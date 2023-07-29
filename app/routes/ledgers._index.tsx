import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { networks } from '~/lib/stellar'
import HorizonServer, { defaultNetworkAddresses } from '~/lib/stellar/server'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import LedgerTable from '../components/LedgerTable'
import { setTitle } from '../lib/utils'

import { ledgers } from '~/lib/stellar/server_request_utils'
import type { LedgerProps } from './ledger.$ledgerId'

const RECORD_LIMIT = 20

export const loader = async () => {
  const server = new HorizonServer(
    networks.future,
    defaultNetworkAddresses.future
  )
  return ledgers(server, RECORD_LIMIT).then(json)
}

export default function Ledgers() {
  const ledgers: ReadonlyArray<LedgerProps> = useLoaderData<typeof loader>()
  const { formatMessage } = useIntl()
  setTitle(formatMessage({ id: 'ledgers' }))
  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="ledgers" />
          </CardHeader>
          <LedgerTable
            records={ledgers}
            compact={false}
          />
        </Card>
      </Row>
    </Container>
  )
}
