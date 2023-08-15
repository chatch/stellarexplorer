import type { ServerApi } from "stellar-sdk"

import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { requestToServer } from '~/lib/stellar/server'

import { LoaderArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import EffectTable from '../components/EffectTable'
import { setTitle } from '../lib/utils'

import { effects } from '~/lib/stellar/server_request_utils'
import { EffectProps } from "~/components/Effect"

export const loader = ({ request }: LoaderArgs): Promise<any> => {
  const server = requestToServer(request)
  return effects(server, {}).then(effects => json(
    effects.map(
      (effect: ServerApi.EffectRecord) => ({
        ...effect,
        op: effect.operation ? effect.operation() : undefined
      })
    )
  ))
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
          <Card.Body>
            <EffectTable
              records={effects}
            // showEffect
            // showSource
            // compact={false}
            // limit={20}
            />
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
