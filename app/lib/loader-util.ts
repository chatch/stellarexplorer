import type { LoaderFunctionArgs, TypedResponse } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { HorizonServerDetails } from './stellar/server'
import HorizonServer, { requestToServer } from './stellar/server'
import * as serverRequestUtils from './stellar/server_request_utils'

export type ServerReqFnName =
  | 'effects'
  | 'ledgers'
  | 'offers'
  | 'operations'
  | 'payments'
  | 'trades'
  | 'transactions'
  | 'liquidityPools'
  | 'claimableBalances'

export function getHorizonRecords<RecordsType>(
  serverDetails: HorizonServerDetails,
  serverReqFnName: ServerReqFnName,
  limit: number,
): Promise<{
  records: RecordsType
  cursor?: string
  horizonURL: string
}> {
  const url = new URL(serverDetails.requestURL)
  const cursor: string | undefined = url.searchParams.get('cursor') ?? undefined
  const order: string | undefined = url.searchParams.get('order') ?? undefined

  const server = new HorizonServer(
    serverDetails.serverAddress,
    serverDetails.networkType as string,
  )

  return serverRequestUtils[serverReqFnName](server, {
    cursor,
    order: order as 'asc' | 'desc',
    limit,
  }).then((records: readonly any[]) => ({
    records: (order === 'asc'
      ? [...records].reverse()
      : records) as RecordsType,
    cursor,
    horizonURL: server.serverURL.toString(),
  }))
}

export function horizonRecordsLoader<RecordsType>(
  serverReqFnName: ServerReqFnName,
  limit: number,
) {
  return async function ({ request }: LoaderFunctionArgs): Promise<
    TypedResponse<{
      records: RecordsType
      cursor?: string
      horizonURL: string
    }>
  > {
    const url = new URL(request.url)
    const cursor: string | undefined =
      url.searchParams.get('cursor') ?? undefined
    const order: string | undefined = url.searchParams.get('order') ?? undefined

    const server = await requestToServer(request)

    return serverRequestUtils[serverReqFnName](server, {
      cursor,
      order: order as 'asc' | 'desc',
      limit,
    }).then((records: readonly any[]) =>
      json({
        records: (order === 'asc'
          ? [...records].reverse()
          : records) as RecordsType,
        cursor,
        horizonURL: server.serverURL.toString(),
      }),
    )
  }
}
