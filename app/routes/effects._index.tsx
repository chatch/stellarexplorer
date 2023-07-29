import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { networks } from '~/lib/stellar'
import HorizonServer, { defaultNetworkAddresses } from '~/lib/stellar/server'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import EffectTable from '../components/EffectTable'
import { setTitle } from '../lib/utils'

import { effects } from '~/lib/stellar/server_request_utils'

// Type is actually just ServerApi.EffectRecord with all prop keys changed to
// camel case
export type EffectProps = Record<string, any>

export const loader = async () => {
  const server = new HorizonServer(
    networks.future,
    defaultNetworkAddresses.future
  )
  return effects(server).then(json)
}

export default function Effects() {
  const effects: ReadonlyArray<EffectProps> = useLoaderData<typeof loader>()
  const { formatMessage } = useIntl()
  setTitle(formatMessage({ id: 'effects' }))
  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="effects" />
          </CardHeader>
          <EffectTable
            records={effects}
          // showEffect
          // showSource
          // compact={false}
          // limit={20}
          />
        </Card>
      </Row>
    </Container>
  )
}
