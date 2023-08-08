import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { FormattedDate, FormattedMessage, FormattedTime, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { networks } from '~/lib/stellar'
import HorizonServer, { defaultNetworkAddresses } from '~/lib/stellar/server'

import { json } from '@remix-run/node'

import { TitleWithJSONButton } from '../components/shared/TitleWithJSONButton'
import { MemoHash, MemoReturn } from '../lib/stellar/sdk'
import { base64DecodeToHex, setTitle } from '../lib/utils'

import type { LoaderArgs } from "@remix-run/node"
import { useLoaderData } from '@remix-run/react'
import { transaction } from '~/lib/stellar/server_request_utils'
import ClipboardCopy from '~/components/shared/ClipboardCopy'

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
  urlFn?: Function
}

export const loader = async ({ params }: LoaderArgs) => {
  const server = new HorizonServer(
    networks.future,
    defaultNetworkAddresses.future
  )
  return transaction(server, params.txHash as string).then(json)
}

export default function Transaction() {
  const { id, fee, ledger, memoType, memo, opCount, time }: Partial<TransactionProps> =
    useLoaderData<typeof loader>()
  const { formatMessage } = useIntl()
  if (!id) return null
  setTitle(`${formatMessage({ id: 'transaction' })} ${id}`)
  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <TitleWithJSONButton
              title={formatMessage({ id: "transaction" })}
              titleSecondary={id}
              url={`/transactions/${id}`} />
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
        <h4>
          <a id="operations-table" aria-hidden="true" />
          <FormattedMessage id="operations" />
          {` (${opCount})`}
        </h4>
        {/* <Container>
          <OperationTable limit={opCount} tx={id} />
        </Container> */}
      </Row>
    </Container>
  )
}