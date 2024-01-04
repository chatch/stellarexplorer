import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import {
  FormattedDate,
  FormattedMessage,
  FormattedNumber,
  FormattedTime,
  useIntl,
} from 'react-intl'
import { Link } from 'react-router-dom'
import { requestToServer } from '~/lib/stellar/server'

import { json } from '@remix-run/node'

import { TitleWithJSONButton } from '../components/shared/TitleWithJSONButton'

import type { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ledger, transactions } from '~/lib/stellar/server_request_utils'
import TransactionTable from '~/components/TransactionTable'
import { setTitle, shortHash } from '~/lib/utils'
import { stroopsToLumens } from '~/lib/stellar/utils'
import Col from 'react-bootstrap/Col'
import { useEffect } from 'react'
import { NotFoundError } from 'stellar-sdk'
import { captureException } from '@sentry/remix'
import { ErrorBoundary } from './lib/error-boundary'

const ledgerHash = (hash: string) => shortHash(hash, 20)

const DetailRow = ({ label, children }: { label: string; children: any }) => (
  <tr>
    <td>
      <FormattedMessage id={label} />
    </td>
    <td>{children}</td>
  </tr>
)

export { ErrorBoundary }

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const server = await requestToServer(request)
  const ledgerSeq = params.ledgerId as string
  let response
  try {
    response = await Promise.all([
      ledger(server, ledgerSeq),
      transactions(server, { ledgerSeq, limit: 100 }),
      server.serverURL.toString(),
    ])
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new Response(null, {
        status: 404,
        statusText: `Ledger ${params.ledgerId} not found on this network.`,
      })
    } else {
      captureException(error)
      throw error
    }
  }
  return json(response)
}

export interface LedgerProps {
  id: string
  pagingToken: string
  hash: string
  prevHash: string
  prevSeq: number
  sequence: number
  successfulTransactionCount: number
  failedTransactionCount: number
  operationCount: number
  time: string
  totalCoins: string
  feePool: string
  maxTxSetSize: number
  protocolVersion: number
  transactionCount: number
  baseFeeInStroops: boolean
  baseFee: number
  baseReserve: number
}

export default function Ledger() {
  const [
    {
      id,
      baseFeeInStroops,
      baseFee,
      baseReserve,
      feePool,
      hash,
      maxTxSetSize,
      operationCount,
      prevHash,
      prevSeq,
      protocolVersion,
      sequence,
      time,
      totalCoins,
      successfulTransactionCount,
      failedTransactionCount,
    },
    transactions,
    horizonURL,
  ]: [LedgerProps, any, string] = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(`${formatMessage({ id: 'ledger' })} ${sequence}`)
  }, [formatMessage, sequence])

  if (!id) return null

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <TitleWithJSONButton
              title={formatMessage({ id: 'ledger' })}
              titleSecondary={String(sequence)}
              url={`${horizonURL}ledgers/${sequence}`}
            />
          </CardHeader>
          <Card.Body>
            <Container>
              <Row>
                <Col md={6}>
                  <Table>
                    <tbody>
                      <DetailRow label="time">
                        <FormattedDate value={time} />{' '}
                        <FormattedTime value={time} />
                      </DetailRow>
                      <DetailRow label="hash">
                        <span title={hash}>{ledgerHash(hash)}</span>
                      </DetailRow>
                      <DetailRow label="prevHash">
                        <span title={prevHash}>
                          <Link to={`/ledger/${prevSeq}`}>
                            {ledgerHash(prevHash)}
                          </Link>
                        </span>
                      </DetailRow>
                      <DetailRow label="operations">{operationCount}</DetailRow>
                      <DetailRow label="transactions.failed">
                        {failedTransactionCount}
                      </DetailRow>
                      <DetailRow label="max.transactions">
                        {maxTxSetSize} per ledger
                      </DetailRow>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <Table>
                    <tbody>
                      <DetailRow label="base.fee">
                        <FormattedNumber value={baseFee} /> stroops
                      </DetailRow>
                      <DetailRow label="base.reserve">
                        {baseFeeInStroops
                          ? stroopsToLumens(baseReserve)
                          : Number(baseReserve)}{' '}
                        XLM
                      </DetailRow>
                      <DetailRow label="fee.pool">
                        <FormattedNumber value={Number(feePool)} /> XLM
                      </DetailRow>
                      <DetailRow label="total.coins">
                        <FormattedNumber value={Number(totalCoins)} /> XLM
                      </DetailRow>
                      <DetailRow label="protocolVersion">
                        {protocolVersion}
                      </DetailRow>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Row>
      {operationCount > 0 && (
        <Row>
          <h5>
            <a id="txs-table" aria-hidden="true" />
            <FormattedMessage id="transactions" />
            &nbsp;({successfulTransactionCount})
          </h5>
          <TransactionTable
            records={transactions}
            compact={false}
            showLedger={false}
            showSource
          />
        </Row>
      )}
    </Container>
  )
}
