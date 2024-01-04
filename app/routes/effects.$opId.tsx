import type { ServerApi } from 'stellar-sdk/lib/horizon'

import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { requestToServer } from '~/lib/stellar/server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import EffectTable from '../components/EffectTable'
import { setTitle } from '../lib/utils'

import { effects } from '~/lib/stellar/server_request_utils'
import type { EffectProps } from '~/components/Effect'
import { useEffect } from 'react'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const server = await requestToServer(request)
  return effects(server, { operationId: params.opId })
    .then((effects) =>
      effects.map(
        (effect: ServerApi.EffectRecord) =>
          ({
            ...effect,
            op: effect.operation ? effect.operation() : undefined,
          }) as EffectProps,
      ),
    )
    .then(json)
}

export default function Effects() {
  const records = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'effects' }))
  }, [formatMessage])

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="effects" />
          </CardHeader>
          <Card.Body>
            <EffectTable
              records={records as ReadonlyArray<EffectProps>}
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
