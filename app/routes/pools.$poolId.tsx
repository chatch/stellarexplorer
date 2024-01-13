import { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { Outlet, useLoaderData, useLocation } from '@remix-run/react'

import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import { FormattedMessage, useIntl } from 'react-intl'

import TabLink from './lib/tab-link-base'

import Table from 'react-bootstrap/Table'

import { TitleWithJSONButton } from '../components/shared/TitleWithJSONButton'
import { setTitle } from '../lib/utils'
import { requestToServer } from '~/lib/stellar/server'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { NotFoundError } from 'stellar-sdk/lib/errors'
import AccountTypeUnrecognizedException from '~/lib/error/AccountTypeUnrecognizedException'
import { captureException } from '@sentry/remix'
import { liquidityPool } from '~/lib/stellar/server_request_utils'
import { formatAmountToHumanReadable } from '~/lib/utilities'
import { PoolAsset } from '~/components/LiquidityPoolTable'

const pathToTabName = (path: string) => {
  const match = /\/pools\/[^/]*\/([a-z]*)/.exec(path)
  return match ? match[1] : 'effects'
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const server = await requestToServer(request)
  const poolId = params.poolId as string
  let response
  try {
    response = await Promise.all([
      liquidityPool(server, poolId),
      server.serverURL.toString(),
    ]).then((result) => ({
      liquidityPool: result[0],
      horizonURL: result[1],
      poolId,
    }))
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new Response(null, {
        status: 404,
        statusText: `Liquidity Pool ${params.poolId} not found on this network.`,
      })
    } else if (error instanceof AccountTypeUnrecognizedException) {
      throw new Response(null, {
        status: 400,
        statusText: error.message,
      })
    } else {
      captureException(error)
      throw error
    }
  }
  return json(response)
}

const LiquidityPoolCard = ({
  liquidityPool,
  horizonURL,
  poolId,
}: {
  liquidityPool: any
  horizonURL: string
  poolId: string
}) => {
  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(`Liquidity Pool ${poolId}`)
  })

  const { totalShares, totalTrustlines, reserves } = liquidityPool

  return (
    <Row>
      <Card>
        <CardHeader>
          <TitleWithJSONButton
            title={formatMessage({ id: 'liquidity-pool' })}
            titleSecondary={poolId}
            url={`${horizonURL}liquidity_pools/${poolId}`}
          />
        </CardHeader>
        <Card.Body>
          <Table>
            <tbody>
              <tr>
                <td>
                  <FormattedMessage id="assets" />
                </td>
                <td>
                  <PoolAsset reserves={reserves} />
                </td>
              </tr>
              <tr>
                <td>
                  <FormattedMessage id="liquidity-pool.shares" />
                </td>
                <td>{formatAmountToHumanReadable(totalShares)}</td>
              </tr>
              <tr>
                <td>
                  <FormattedMessage id="liquidity-pool.trustlines" />
                </td>
                <td>{totalTrustlines}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Row>
  )
}

export default function LiquidityPool() {
  const [activeTab, setActiveTab] = useState('effects')
  const { pathname } = useLocation()

  useEffect(() => {
    setActiveTab(pathToTabName(pathname))
  }, [pathname])

  const { liquidityPool, horizonURL, poolId } = useLoaderData<typeof loader>()
  const base = `/pools/${poolId}`

  return (
    <Container>
      <LiquidityPoolCard
        liquidityPool={liquidityPool}
        horizonURL={horizonURL}
        poolId={poolId}
      />
      <Row>
        {/* FIXME: code in this file was copied from account.$accountId.tsx and modified.
            account-nav and account-tab-content are used as they are.
            Because we should use one general class instead of adding id, such as account-nav, contract-nav, etc */}
        <nav id="account-nav">
          <TabLink base={base} activeTab={activeTab} title="Effects" />
          <TabLink base={base} activeTab={activeTab} title="Trades" />
          <TabLink base={base} activeTab={activeTab} title="Transactions" />
          <TabLink base={base} activeTab={activeTab} title="Operations" />
        </nav>
        <div id="account-tab-content">
          <Outlet />
        </div>
      </Row>
    </Container>
  )
}
