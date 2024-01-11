import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLoaderData } from '@remix-run/react'

import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { setTitle } from '../lib/utils'

import { horizonRecordsLoader } from '~/lib/loader-util'
import Paging from '~/components/shared/Paging'
import type { LiquidityPoolProps } from '~/components/operations/LiquidityPool'
import LiquidityPoolTable from '~/components/LiquidityPoolTable'

const RECORD_LIMIT = 30

export const loader = horizonRecordsLoader<ReadonlyArray<LiquidityPoolProps>>(
  'liquidityPools',
  RECORD_LIMIT,
)

export default function LiquidityPools() {
  const { records, cursor } = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'liquidity-pools' }))
  }, [formatMessage])

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="liquidity-pools" />
          </CardHeader>
          <Card.Body>
            <Paging baseUrl="/pools" records={records} currentCursor={cursor}>
              <LiquidityPoolTable
                records={records as LiquidityPoolProps[]}
                compact={false}
              />
            </Paging>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
