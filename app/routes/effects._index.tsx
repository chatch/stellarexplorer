import { Card, Container, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { requestToServer } from '~/lib/stellar/server'

import type { LoaderFunctionArgs } from '~/lib/remix-shim'
import { json } from '~/lib/remix-shim'
import { useLoaderData } from '@remix-run/react'

import EffectTable from '../components/EffectTable'
import { safeNewURL, setTitle } from '../lib/utils'

import { effects } from '~/lib/stellar/server_request_utils'
import type { EffectProps } from '~/components/Effect'
import { useEffect } from 'react'
import Paging from '~/components/shared/Paging'

export const clientLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = safeNewURL(request.url)
  const cursor: string | undefined = url.searchParams.get('cursor') ?? undefined
  const order: string | undefined = url.searchParams.get('order') ?? undefined

  const server = await requestToServer(request)
  const records = await effects(server, {
    cursor,
    order: order as 'asc' | 'desc',
    limit: 30,
  })

  return json({
    records,
    cursor,
    horizonURL: server.serverURL.toString(),
  })
}

export default function Effects() {
  const { records, cursor } = useLoaderData<typeof clientLoader>()

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
            <Paging baseUrl="/effects" records={records} currentCursor={cursor}>
              <EffectTable
                records={records as ReadonlyArray<EffectProps>}
                // showEffect
                // showSource
                // compact={false}
                // limit={20}
              />
            </Paging>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
