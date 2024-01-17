import {
  transactions,
  operations,
  claimableBalance,
} from '~/lib/stellar/server_request_utils'
import { requestToServer } from '~/lib/stellar/server'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { NotFoundError } from 'stellar-sdk'
import { captureException } from '@sentry/remix'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

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

import { TitleWithJSONButton } from '../components/shared/TitleWithJSONButton'
import { MemoHash, MemoReturn } from '../lib/stellar/sdk'
import { base64DecodeToHex, setTitle } from '../lib/utils'

import OperationTable from '~/components/OperationTable'
import { useEffect } from 'react'
import { memoTypeToLabel } from './tx.$txHash'
import { ClaimableBalanceRow } from '~/components/ClaimableBalanceTable'
import type { ClaimableBalanceProps } from '~/components/operations/ClaimableBalances'

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const server = await requestToServer(request)
  let response
  try {
    response = await Promise.all([
      claimableBalance(server, params.balanceId as string),
      transactions(server, { claimableBalanceId: params.balanceId as string }),
      operations(server, { claimableBalanceId: params.balanceId as string }),
      server.serverURL.toString(),
    ]).then(([claimableBalance, transactions, operations, horizonURL]) => {
      return {
        claimableBalance,
        claimableBalanceTransactions: transactions,
        operationsForClaimableBalance: operations,
        horizonURL,
      }
    })
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new Response(null, {
        status: 404,
        statusText: `Claimable Balance ${params.txHash} not found on this network.`,
      })
    } else {
      captureException(error)
      throw error
    }
  }
  return json(response)
}

export default function ClaimableBalance() {
  const {
    claimableBalance,
    claimableBalanceTransactions,
    operationsForClaimableBalance,
    horizonURL,
  } = useLoaderData<typeof loader>()
  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(`${formatMessage({ id: 'claimable-balances' })} ${id}`)
  })
  const { id, fee, ledger, memo, time } = claimableBalanceTransactions[0]
  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <TitleWithJSONButton
              title={formatMessage({ id: 'claimable-balance' })}
              titleSecondary={claimableBalance.id}
              url={`${horizonURL}claimable_balances/${claimableBalance.id}`}
            />
          </CardHeader>
          <Card.Body>
            <table className="table table-striped table-bordered table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>
                    <FormattedMessage id="amount" />
                  </th>
                  <th>
                    <FormattedMessage id="sponsor" />
                  </th>
                  <th>
                    <FormattedMessage id="balance" />
                  </th>
                  <th>
                    <FormattedMessage id="updated-at" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <ClaimableBalanceRow
                  key={claimableBalance.id}
                  idx={0}
                  {...(claimableBalance as ClaimableBalanceProps)}
                  isClaimant={false}
                />
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </Row>
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
                      {memo && `${memoTypeToLabel[memo]}`}
                    </span>
                  </td>
                  <td>
                    {memo === MemoHash || memo === MemoReturn
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
          {` (${operationsForClaimableBalance.length})`}
        </h5>
        <Container>
          <OperationTable
            records={operationsForClaimableBalance}
            compact={false}
            horizonURL={horizonURL}
          />
        </Container>
      </Row>
    </Container>
  )
}
