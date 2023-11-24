import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'
import { Container, Row } from 'react-bootstrap'
import type { PaymentProps } from '~/components/operations/Payment'
import Paging from '~/components/shared/Paging'
import * as serverRequestUtils from '../../lib/stellar/server_request_utils'
import { requestToServer } from '~/lib/stellar/server'
import type { FunctionComponent } from 'react'
import { useEffect } from 'react'
import { setTitle } from '~/lib/utils'
import type { ServerReqFnName } from '~/lib/loader-util'

const DEFAULT_RECORD_LIMIT = 30

const accountTabLoader =
  (serverRequestFnName: ServerReqFnName, limit?: number) =>
  ({ request, params }: LoaderArgs) => {
    const url = new URL(request.url)
    const cursor: string | undefined =
      url.searchParams.get('cursor') ?? undefined
    const order: string | undefined = url.searchParams.get('order') ?? undefined

    const server = requestToServer(request)

    return serverRequestUtils[serverRequestFnName](server, {
      accountId: params.accountId,
      cursor,
      order: order as 'asc' | 'desc',
      limit: limit ?? DEFAULT_RECORD_LIMIT,
    }).then((records: any) =>
      json({
        records: order === 'asc' ? [...records].reverse() : records,
        cursor,
        horizonURL: server.serverURL.toString(),
      }),
    )
  }

const accountTabComponent = function <loaderFnType>(
  TableComponent: FunctionComponent<{
    records: ReadonlyArray<any>
    compact: boolean
    horizonURL: string
  }>,
  name: string,
  subpath = name?.toLowerCase(),
) {
  return function AccountTabComponent() {
    const {
      records,
      cursor,
      horizonURL,
    }: {
      records?: ReadonlyArray<PaymentProps>
      cursor?: string
      horizonURL: string
    } = useLoaderData<loaderFnType>() as any

    const { accountId } = useParams()
    useEffect(() => {
      setTitle(`Account ${name} ${accountId}`)
    }, [])

    if (!records || records.length == 0) {
      return <div style={{ marginTop: 20, marginBottom: 20 }}>No Records</div>
    }

    return (
      <Container>
        <Row>
          <Paging
            baseUrl={`/account/${accountId}/${subpath}`}
            records={records ?? []}
            currentCursor={cursor}
          >
            <TableComponent
              records={records ?? []}
              compact={false}
              horizonURL={horizonURL}
            />
          </Paging>
        </Row>
      </Container>
    )
  }
}

export { accountTabComponent, accountTabLoader }
