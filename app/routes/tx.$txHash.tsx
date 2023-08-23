import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { FormattedDate, FormattedMessage, FormattedTime, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { requestToServer } from '~/lib/stellar/server'

import { json } from '@remix-run/node'

import { TitleWithJSONButton } from '../components/shared/TitleWithJSONButton'
import { MemoHash, MemoReturn } from '../lib/stellar/sdk'
import { base64DecodeToHex, setTitle } from '../lib/utils'

import type { LoaderArgs } from "@remix-run/node"
import { useLoaderData } from '@remix-run/react'
import { operations, transaction } from '~/lib/stellar/server_request_utils'
import ClipboardCopy from '~/components/shared/ClipboardCopy'
import OperationTable from '~/components/OperationTable'
import { useEffect } from 'react'

// Lookup memo type to a label
const memoTypeToLabel: Record<string, string> = Object.freeze({
  id: "ID",
  hash: "Hash",
  none: "None",
  return: "Return",
  text: "Text",
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

export const loader = ({ params, request }: LoaderArgs) => {
  const server = requestToServer(request)
  return Promise.all([
    transaction(server, params.txHash as string),
    operations(server, { tx: params.txHash, limit: 10 }),
    server.serverURL.toString()
  ]).then(json)
}

export default function Transaction() {
  const [
    { id, fee, ledger, memoType, memo, opCount, time },
    operations,
    horizonURL
  ]: [
      tx: Partial<TransactionProps>,
      operations: any,
      horizonURL: string
    ] =
    useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(`${formatMessage({ id: 'transaction' })} ${id}`)
  }, [])

  if (!id) return null

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <TitleWithJSONButton
              title={formatMessage({ id: "transaction" })}
              titleSecondary={id}
              url={`${horizonURL}transactions/${id}`} />
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
                    <FormattedMessage id="memo" />{" "}
                    <span className="secondary-heading">
                      ({memoType && memoTypeToLabel[memoType]})
                    </span>
                  </td>
                  <td>
                    {memoType === MemoHash || memoType === MemoReturn
                      ? base64DecodeToHex(memo)
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
          <OperationTable records={operations} compact horizonURL={horizonURL} />
        </Container>
      </Row>
    </Container>
  )
}