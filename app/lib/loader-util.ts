import { LoaderArgs, TypedResponse, json } from "@remix-run/node"
import { requestToServer } from "./stellar/server"
import * as serverRequestUtils from "./stellar/server_request_utils"

export type ServerReqFnName =
    | 'effects'
    | 'ledgers'
    | 'offers'
    | 'operations'
    | 'payments'
    | 'trades'
    | 'transactions'

export function horizonRecordsLoader<RecordsType>(
    serverReqFnName: ServerReqFnName,
    limit: number
) {
    return function ({ request }: LoaderArgs): Promise<TypedResponse<{
        records: RecordsType,
        cursor?: string,
        horizonURL: string
    }>> {
        const url = new URL(request.url)
        const cursor: string | undefined = url.searchParams.get("cursor") ?? undefined
        const order: string | undefined = url.searchParams.get("order") ?? undefined

        const server = requestToServer(request)

        return serverRequestUtils[serverReqFnName](server, {
            cursor,
            order: order as 'asc' | 'desc',
            limit
        }).then((records) => json({
            records: (order === 'asc' ? [...records].reverse() : records) as RecordsType,
            cursor,
            horizonURL: server.serverURL.toString()
        }))
    }
}