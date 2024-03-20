import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import {
  FormattedDate,
  FormattedMessage,
  FormattedTime,
  useIntl,
} from 'react-intl'
import { Link } from 'react-router-dom'
import type { HorizonServerDetails } from '~/lib/stellar/server'
import HorizonServer, { requestToServerDetails } from '~/lib/stellar/server'

import { json } from '@remix-run/node'

import { TitleWithJSONButton } from '../components/shared/TitleWithJSONButton'
import { MemoHash, MemoReturn } from '../lib/stellar/sdk'
import { base64DecodeToHex, setTitle } from '../lib/utils'

import type { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'
import {
  operations as operationsGet,
  transaction as transactionGet,
} from '~/lib/stellar/server_request_utils'
import OperationTable from '~/components/OperationTable'
import { useEffect, useState } from 'react'
import { captureException } from '@sentry/remix'
import { NotFoundError } from 'stellar-sdk'
import { ErrorBoundary } from './lib/error-boundary'

// Lookup memo type to a label
export const memoTypeToLabel: Record<string, string> = Object.freeze({
  id: 'ID',
  hash: 'Hash',
  none: 'None',
  return: 'Return',
  text: 'Text',
})

export interface TransactionProps {
  id: string
  hash: string
  sourceAccount: string
  fee: number | string
  ledger: number
  memo?: string
  memoType: string
  opCount: number
  operations?: ReadonlyArray<any>
  time: string
  pagingToken: string
  urlFn?: Function
}

export type TransactionResponse = [
  tx: Partial<TransactionProps>,
  operations: any,
  horizonURL: string,
]

export { ErrorBoundary }

export const loader = ({ request }: LoaderFunctionArgs) =>
  requestToServerDetails(request)

export default function Transaction() {
  const { formatMessage } = useIntl()
  const { txHash } = useParams()
  const [response, setResponse]: [TransactionResponse | null, any] =
    useState(null)
  const serverDetails = useLoaderData<typeof loader>() as HorizonServerDetails

  useEffect(() => {
    const server = new HorizonServer(
      serverDetails.serverAddress,
      serverDetails.networkType as string,
    )

    setTitle(`${formatMessage({ id: 'transaction' })} ${txHash}`)

    Promise.all([
      transactionGet(server, txHash as string),
      operationsGet(server, { tx: txHash, limit: 100 }),
      server.serverURL.toString(),
    ])
      .then(json)
      .then(setResponse)
      .catch((error) => {
        if (error instanceof NotFoundError) {
          throw new Response(null, {
            status: 404,
            statusText: `Transaction ${txHash} not found on this network.`,
          })
        } else {
          captureException(error)
          throw error
        }
      })
  }, [formatMessage, txHash])

  if (!Array.isArray(response) || (response as Array<any>).length !== 3)
    return null

  const [
    { id, fee, ledger, memoType, memo, opCount, time },
    operations,
    horizonURL,
  ]: [tx: Partial<TransactionProps>, operations: any, horizonURL: string] =
    response as any

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <TitleWithJSONButton
              title={formatMessage({ id: 'transaction' })}
              titleSecondary={id}
              url={`${horizonURL}transactions/${id}`}
            />
          </CardHeader>
          <Card.Body>
            <Table>
              <tbody>
                <tr>
                  <td>
                    <FormattedMessage id="time" />
                  </td>
                  <td>
                    <FormattedDate value={time} />
                    &nbsp;
                    <FormattedTime value={time} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="fee" />
                  </td>
                  <td>{fee} stroops</td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="ledger" />
                  </td>
                  <td>
                    <Link to={`/ledger/${ledger}`}>{ledger}</Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="memo" />{' '}
                    <span className="secondary-heading">
                      ({memoType && memoTypeToLabel[memoType]})
                    </span>
                  </td>
                  <td>
                    {memoType === MemoHash || memoType === MemoReturn
                      ? base64DecodeToHex(memo as string)
                      : memo}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Row>
      <Row>
        <h5>
          <a id="operations-table" aria-hidden="true" />
          <FormattedMessage id="operations" />
          {` (${opCount})`}
        </h5>
        <Container>
          <OperationTable
            records={operations}
            compact
            horizonURL={horizonURL}
          />
        </Container>
      </Row>
    </Container>
  )
}
