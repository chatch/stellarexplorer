import { Container, Row } from 'react-bootstrap'
import type { ClaimableBalanceProps } from '~/components/operations/ClaimableBalances'
import { useLoaderData } from '@remix-run/react'
import ClaimableBalanceTable from '~/components/ClaimableBalanceTable'
import { useIntl } from 'react-intl'
import { useEffect } from 'react'
import { setTitle } from '../lib/utils'
import { Tab, Tabs } from 'react-bootstrap'
import { requestToServer } from '~/lib/stellar/server'
import type { LoaderFunctionArgs } from '~/lib/remix-shim'
import { json } from '~/lib/remix-shim'
import { NotFoundError } from '@stellar/stellar-sdk'
import { captureException } from '@sentry/remix'
import { claimableBalances } from '~/lib/stellar/server_request_utils'

export const clientLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const server = await requestToServer(request)
  let response
  try {
    response = await Promise.all([
      claimableBalances(server, {
        claimant: params.accountId as string,
        limit: 30,
      }),
      claimableBalances(server, {
        sponsor: params.accountId as string,
        limit: 30,
      }),
    ]).then(([claimants, sponsors]) => {
      return { claimants, sponsors }
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

export default function ClaimableBalances() {
  const { claimants, sponsors } = useLoaderData<typeof clientLoader>()
  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'claimable-balances' }))
  })

  return (
    <Container>
      <Row>
        <Tabs defaultActiveKey="claimant">
          <Tab
            id="tab-container"
            eventKey="claimant"
            title={formatMessage({ id: 'claimant' })}
          >
            <ClaimableBalanceTable
              records={claimants as ClaimableBalanceProps[]}
              isClaimant={true}
            />
          </Tab>
          <Tab
            id="tab-container"
            eventKey="sponsor"
            title={formatMessage({ id: 'sponsor' })}
          >
            <ClaimableBalanceTable
              records={sponsors as ClaimableBalanceProps[]}
              isClaimant={false}
            />
          </Tab>
        </Tabs>
      </Row>
    </Container>
  )
}