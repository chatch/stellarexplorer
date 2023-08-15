import { LoaderArgs, json } from "@remix-run/node"
import { requestToServer } from "./stellar/server"
import * as serverRequestUtils from "./stellar/server_request_utils"

type ServerReqFnName =
    | 'ledgers'
    | 'transactions'
    | 'operations'
    | 'payments'
    | 'trades'

export const allRecordsWithPagingLoader = (
    serverReqFnName: ServerReqFnName,
    limit: number
) => ({ request }: LoaderArgs) => {
    const url = new URL(request.url)
    const cursor: string | undefined = url.searchParams.get("cursor") ?? undefined
    const order: string | undefined = url.searchParams.get("order") ?? undefined

    const server = requestToServer(request)

    return serverRequestUtils[serverReqFnName](server, {
        cursor,
        order: order as 'asc' | 'desc',
        limit
    }).then((records) => json({
        records: order === 'asc' ? [...records].reverse() : records,
        cursor
    }))
}