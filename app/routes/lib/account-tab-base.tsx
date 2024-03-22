import { useLoaderData, useParams } from '@remix-run/react'
import { Container, Row } from 'react-bootstrap'
import type { PaymentProps } from '~/components/operations/Payment'
import Paging from '~/components/shared/Paging'
import * as serverRequestUtils from '../../lib/stellar/server_request_utils'
import type { HorizonServerDetails } from '~/lib/stellar/server'
import HorizonServer, { requestToServerDetails } from '~/lib/stellar/server'
import type { FunctionComponent } from 'react'
import { useEffect, useState } from 'react'
import { setTitle } from '~/lib/utils'
import type { ServerReqFnName } from '~/lib/loader-util'
import type { loader } from '../tx.$txHash'
import type { LoaderFunctionArgs } from '@remix-run/node'

const DEFAULT_RECORD_LIMIT = 30

const accountTabLoader =
  () =>
  ({ request }: LoaderFunctionArgs) =>
    requestToServerDetails(request)

const accountTabComponent = function <loaderFnType>(
  TableComponent: FunctionComponent<{
    records: ReadonlyArray<any>
    compact: boolean
    horizonURL: string
  }>,
  name: string,
  serverRequestFnName: ServerReqFnName,
  limit?: number,
  subpath = name?.toLowerCase(),
) {
  return function AccountTabComponent() {
    const serverDetails = useLoaderData<typeof loader>() as HorizonServerDetails
    const [serverResult, setServerResult] = useState(null)

    const { accountId } = useParams()
    useEffect(() => {
      if (typeof window !== 'undefined') {
        setTitle(`Account ${name} ${accountId}`)

        const server = new HorizonServer(
          serverDetails.serverAddress,
          serverDetails.networkType as string,
        )

        const url = new URL(serverDetails.requestURL)
        const cursor: string | undefined =
          url.searchParams.get('cursor') ?? undefined
        const order: string | undefined =
          url.searchParams.get('order') ?? undefined

        serverRequestUtils[serverRequestFnName](server, {
          accountId: accountId,
          cursor,
          order: order as 'asc' | 'desc',
          limit: limit ?? DEFAULT_RECORD_LIMIT,
        }).then((records: any) =>
          setServerResult({
            records: order === 'asc' ? [...records].reverse() : records,
            cursor,
            horizonURL: server.serverURL.toString(),
          } as any),
        )
      }
    }, [accountId])

    if (!serverResult) {
      return
    }

    const {
      records,
      cursor,
      horizonURL,
    }: {
      records?: ReadonlyArray<PaymentProps>
      cursor?: string
      horizonURL: string
    } = serverResult as any

    if (!records || records.length === 0) {
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
