import type { ServerApi } from "stellar-sdk"

import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { requestToServer } from '~/lib/stellar/server'

import { LoaderArgs, defer } from '@remix-run/node'
import { Await, useLoaderData } from '@remix-run/react'

import EffectTable from '../components/EffectTable'
import { setTitle } from '../lib/utils'

import { effects } from '~/lib/stellar/server_request_utils'
import { EffectProps } from "~/components/Effect"
import { Suspense, useEffect } from "react"

export const loader = ({ request }: LoaderArgs) => {
  const server = requestToServer(request)
  const responsePromise: Promise<ReadonlyArray<EffectProps>> = effects(server, { limit: 30 }).then(effects =>
    effects.map(
      (effect: ServerApi.EffectRecord) => ({
        ...effect,
        op: effect.operation ? effect.operation() : undefined
      }) as EffectProps
    )
  )
  return defer({
    response: responsePromise,
  })
}

export default function Effects() {
  const { response } = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'effects' }))
  }, [])

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="effects" />
          </CardHeader>
          <Card.Body>
            <Suspense
              fallback={<p>Loading ...</p>}
            >
              <Await
                resolve={response}
                errorElement={
                  <p>Error loading data</p>
                }
              >
                {(records) => <EffectTable
                  records={records as ReadonlyArray<EffectProps>}
                // showEffect
                // showSource
                // compact={false}
                // limit={20}
                />
                }
              </Await>
            </Suspense>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
