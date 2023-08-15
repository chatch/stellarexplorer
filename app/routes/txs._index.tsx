import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { requestToServer } from '~/lib/stellar/server'

import { LoaderArgs, json } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'

import TransactionTable from '../components/TransactionTable'
import { setTitle } from '../lib/utils'

import { transactions } from '~/lib/stellar/server_request_utils'
import type { TransactionProps } from './tx.$txHash'
import { MouseEventHandler } from 'react'
import Paging from '~/components/shared/Paging'

const RECORD_LIMIT = 20

export const loader = ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const cursor: string | undefined = url.searchParams.get("cursor") ?? undefined
  const order: string | undefined = url.searchParams.get("order") ?? undefined

  const server = requestToServer(request)

  return transactions(server, {
    cursor,
    order: order as 'asc' | 'desc',
    limit: RECORD_LIMIT
  }).then((transactions) => json({
    transactions: order === 'asc' ? [...transactions].reverse() : transactions,
    cursor
  }))
}


export default function Transactions() {
  const { transactions, cursor }: { transactions: ReadonlyArray<TransactionProps>, cursor?: string } = useLoaderData<typeof loader>()
  const { formatMessage } = useIntl()
  const navigate = useNavigate()

  setTitle(formatMessage({ id: 'transactions' }))

  const handleClickNext: MouseEventHandler<HTMLElement> = () => {
    const cursorNext = transactions[transactions.length - 1].pagingToken
    navigate(`/txs?cursor=${cursorNext}&order=desc`)
  }

  const handleClickPrev: MouseEventHandler<HTMLElement> = () => {
    const cursorPrev = transactions[0].pagingToken
    navigate(`/txs?cursor=${cursorPrev}&order=asc`)
  }

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="transactions" />
          </CardHeader>
          <Card.Body>
            <Paging
              handleClickNext={handleClickNext}
              handleClickPrev={handleClickPrev}
              hidePrev={!cursor}>
              <TransactionTable
                records={transactions}
                showLedger
                showSource
                compact={false}
              />
            </Paging>
          </Card.Body>
        </Card>
      </Row>
    </Container >
  )
}
