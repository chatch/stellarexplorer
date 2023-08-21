import { LoaderArgs, TypedResponse, defer, json } from "@remix-run/node"
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
        cursor?: string
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
            cursor
        }))
    }
}

export function horizonRecordsLoaderWithDefer<RecordsType>(
    serverReqFnName: ServerReqFnName,
    limit: number
) {
    return function ({ request }: LoaderArgs) {
        const url = new URL(request.url)
        const cursor: string | undefined = url.searchParams.get("cursor") ?? undefined
        const order: string | undefined = url.searchParams.get("order") ?? undefined

        const server = requestToServer(request)

        const serverResponsePromise = serverRequestUtils[
            serverReqFnName
        ](server, {
            cursor,
            order: order as 'asc' | 'desc',
            limit
        }).then((records) => ({
            records: (order === 'asc' ?
                [...records].reverse() :
                records
            ) as RecordsType,
            cursor
        }))

        return defer({
            response: serverResponsePromise,
        })
    }
}