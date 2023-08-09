import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { FormattedDate, FormattedMessage, FormattedNumber, FormattedTime, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { networks } from '~/lib/stellar'
import HorizonServer, { defaultNetworkAddresses } from '~/lib/stellar/server'

import { json } from '@remix-run/node'

import { TitleWithJSONButton } from '../components/shared/TitleWithJSONButton'

import type { LoaderArgs } from "@remix-run/node"
import { useLoaderData } from '@remix-run/react'
import { ledger, transactions } from '~/lib/stellar/server_request_utils'
import TransactionTable from '~/components/TransactionTable'
import { setTitle, shortHash } from '~/lib/utils'
import { stroopsToLumens } from '~/lib/stellar/utils'
import Col from 'react-bootstrap/Col'


const ledgerHash = (hash: string) => shortHash(hash, 20)

const DetailRow = ({ label, children }: { label: string, children: any }) => (
  <tr>
    <td>
      <FormattedMessage id={label} />
    </td>
    <td>{children}</td>
  </tr>
)

export const loader = async ({ params }: LoaderArgs) => {
  const server = new HorizonServer(
    networks.future,
    defaultNetworkAddresses.future
  )
  const ledgerSeq = params.ledgerId as string
  return Promise.all([
    ledger(server, ledgerSeq),
    transactions(server, ledgerSeq)
  ]).then(json)
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
  baseFeeInStroops: boolean,
  baseFee: number
  baseReserve: number
}

export default function Ledger() {
  const [{
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
    failedTransactionCount
  }, transactions]: [LedgerProps, any] =
    useLoaderData<typeof loader>()
  const { formatMessage } = useIntl()

  if (!id) return null

  setTitle(`${formatMessage({ id: 'ledger' })} ${id}`)
  // setTitle(`Ledger ${rsp.sequence}`);

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <TitleWithJSONButton
              title={formatMessage({ id: "ledger" })}
              titleSecondary={String(sequence)}
              url={`/ledgers/${id}`} />
          </CardHeader>
          <Card.Body>
            <Container>
              <Row>
                <Col md={6}>
                  <Table>
                    <tbody>
                      <DetailRow label="time">
                        <FormattedDate value={time} />{" "}
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
                          : Number(baseReserve)}{" "}
                        XLM
                      </DetailRow>
                      <DetailRow label="fee.pool">
                        <FormattedNumber value={Number(feePool)} /> XLM
                      </DetailRow>
                      <DetailRow label="total.coins">
                        <FormattedNumber value={Number(totalCoins)} /> XLM
                      </DetailRow>
                      <DetailRow label="protocolVersion">{protocolVersion}</DetailRow>
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