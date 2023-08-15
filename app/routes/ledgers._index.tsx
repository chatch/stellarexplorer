import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { requestToServer } from '~/lib/stellar/server'

import { LoaderArgs, json } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'

import LedgerTable from '../components/LedgerTable'
import { setTitle } from '../lib/utils'

import { ledgers } from '~/lib/stellar/server_request_utils'
import type { LedgerProps } from './ledger.$ledgerId'
import Paging from '~/components/shared/Paging'
import { MouseEventHandler } from 'react'

const RECORD_LIMIT = 20

export const loader = ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const cursor: string | undefined = url.searchParams.get("cursor") ?? undefined
  const order: string | undefined = url.searchParams.get("order") ?? undefined

  const server = requestToServer(request)

  return ledgers(server, {
    cursor,
    order: order as 'asc' | 'desc',
    limit: RECORD_LIMIT
  }).then((ledgers) => json({
    ledgers: order === 'asc' ? [...ledgers].reverse() : ledgers,
    cursor
  }))
}

export default function Ledgers() {
  const { ledgers, cursor }: { ledgers: ReadonlyArray<LedgerProps>, cursor?: string } = useLoaderData<typeof loader>()
  const { formatMessage } = useIntl()
  const navigate = useNavigate()

  setTitle(formatMessage({ id: 'ledgers' }))

  const handleClickNext: MouseEventHandler<HTMLElement> = () => {
    const cursorNext = ledgers[ledgers.length - 1].pagingToken
    navigate(`/ledgers?cursor=${cursorNext}&order=desc`)
  }

  const handleClickPrev: MouseEventHandler<HTMLElement> = () => {
    const cursorPrev = ledgers[0].pagingToken
    navigate(`/ledgers?cursor=${cursorPrev}&order=asc`)
  }

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="ledgers" />
          </CardHeader>
          <Card.Body>
            <Paging
              handleClickNext={handleClickNext}
              handleClickPrev={handleClickPrev}
              hidePrev={!cursor}>
              <LedgerTable
                records={ledgers}
                compact={false}
              />
            </Paging>
          </Card.Body>
        </Card>
      </Row>
    </Container >
  )
}
