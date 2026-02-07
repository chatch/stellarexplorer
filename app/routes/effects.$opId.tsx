import { Card, Container, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { requestToServer } from '~/lib/stellar/server'

import type { LoaderFunctionArgs } from '~/lib/remix-shim'
import { json } from '~/lib/remix-shim'
import { useLoaderData } from '@remix-run/react'

import EffectTable from '../components/EffectTable'
import { setTitle } from '../lib/utils'

import { effects } from '~/lib/stellar/server_request_utils'
import type { EffectProps } from '~/components/Effect'
import { useEffect } from 'react'

export const clientLoader = async ({ request, params }: LoaderFunctionArgs) => {
  const server = await requestToServer(request)
  const records = await effects(server, { operationId: params.opId })

  return json({
    records,
    horizonURL: server.serverURL.toString(),
  })
}

export default function Effects() {
  const { records } = useLoaderData<typeof clientLoader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'effects' }))
  }, [formatMessage])

  return (
    <Container>
      <Row>
        <Card>
          <Card.Header>
            <FormattedMessage id="effects" />
          </Card.Header>
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
