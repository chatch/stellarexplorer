import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'

import { Outlet, useLoaderData, useLocation, useParams } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'

import { captureException } from '@sentry/remix'
import has from 'lodash/has'
import { NotFoundError } from 'stellar-sdk'
import type { ServerApi } from 'stellar-sdk/lib/horizon'

import type { KnownAccountProps } from '../data/known_accounts'
import knownAccounts from '../data/known_accounts'
import { setTitle } from '../lib/utils'
import { titleWithJSONButton } from '../components/shared/TitleWithJSONButton'
import ClipboardCopy from '../components/shared/ClipboardCopy'
import Logo from '../components/shared/Logo'
import type { HorizonServerDetails } from '~/lib/stellar/server'
import HorizonServer, { requestToServerDetails } from '~/lib/stellar/server'
import type { LoadAccountResult } from '~/lib/stellar/server_request_utils'
import { loadAccount } from '~/lib/stellar/server_request_utils'
import AccountTypeUnrecognizedException from '~/lib/error/AccountTypeUnrecognizedException'
import TabLink from './lib/tab-link-base'

import infoSvg from '../../public/info-solid.svg'
import { ErrorBoundary } from './lib/error-boundary'

// exists in @types/react-bootstrap however can't seem to resolve it
// when importing it from react-bootstrap (compiler should find it).
// so dupliating it partially here:
export interface SelectCallback extends React.EventHandler<any> {
  (eventKey: any, e: React.SyntheticEvent<{}>): void
}

const MuxedAccountInfoCard = ({ address }: { address: string }) => {
  return (
    <Card>
      <img
        src={infoSvg}
        style={{ color: 'white', height: 14, width: 14, marginLeft: 10 }}
        alt="Info icon"
      />
      &nbsp; NOTE: This view shows the base account of the multiplexed account
      &nbsp;
      <span style={{ color: 'white', overflowWrap: 'break-word' }}>
        {address}
      </span>
    </Card>
  )
}

const AccountSummaryCard = ({
  account,
  accountUrl,
  federatedAddress,
  knownAccounts,
}: {
  account: ServerApi.AccountRecord
  accountUrl: string
  federatedAddress?: string
  knownAccounts: Record<string, KnownAccountProps>
}) => {
  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(`Account ${account.id}`)
  }, [account.id])
  return (
    <Card id="account-summary-card">
      <CardHeader>
        {titleWithJSONButton(formatMessage({ id: 'account' }), accountUrl)}
      </CardHeader>
      <Card.Body>
        <Container style={{ paddingLeft: 0 }}>
          <Row>
            <Col md={10}>
              <Row>
                <Col md={3}>
                  <FormattedMessage id="key.public" />:
                </Col>
                <Col md={9}>
                  <span id="account-id" className="break">
                    {account.id}
                  </span>
                  <ClipboardCopy text={account.id} />
                </Col>
              </Row>
              {federatedAddress && (
                <Row>
                  <Col md={3}>
                    <FormattedMessage id="stellar.address" />:
                  </Col>
                  <Col md={9}>{federatedAddress}</Col>
                </Row>
              )}
              <Row>
                <Col md={3}>
                  <FormattedMessage id="home.domain" />:
                </Col>
                <Col md={9}>
                  <a
                    href={`https://${account.home_domain}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {account.home_domain}
                  </a>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <FormattedMessage id="subentry.count" />:
                </Col>
                <Col md={9}>{account.subentry_count}</Col>
              </Row>
            </Col>
            {has(knownAccounts, account.id) &&
              knownAccounts[account.id].logo && (
                <Col md={2}>
                  <div style={{ marginBottom: 10 }}>
                    <Logo
                      type={knownAccounts[account.id].type}
                      name={knownAccounts[account.id].logo}
                    />
                  </div>
                </Col>
              )}
          </Row>
        </Container>
      </Card.Body>
    </Card>
  )
}

const pathToTabName = (path: string) => {
  const match = /\/account\/[^/]*\/([a-z]*)/.exec(path)
  return match ? match[1] : 'balances'
}

export { ErrorBoundary }

export const loader = ({ request }: LoaderFunctionArgs) =>
  requestToServerDetails(request)

export default function Account() {
  const serverDetails = useLoaderData<typeof loader>() as HorizonServerDetails
  const { accountId } = useParams()

  const [activeTab, setActiveTab] = useState('data')
  const [accountResponse, setAccountResponse] = useState(null)

  const { pathname } = useLocation()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActiveTab(pathToTabName(pathname))

      const server = new HorizonServer(
        serverDetails.serverAddress,
        serverDetails.networkType as string,
      )
      Promise.all([
        loadAccount(server, accountId as string),
        server.serverURL.toString(),
      ])
        .then((result) => ({ accountResult: result[0], horizonURL: result[1] }))
        .then(setAccountResponse as any)
        .catch((error) => {
          if (error instanceof NotFoundError) {
            throw new Response(null, {
              status: 404,
              statusText: `Account ${accountId} not found on this network.`,
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
        })
    }
  }, [pathname])

  if (!accountResponse) {
    return
  }

  const {
    accountResult,
    horizonURL,
  }: { accountResult: LoadAccountResult; horizonURL: string } =
    accountResponse as any

  const { account, muxedAddress, federatedAddress } = accountResult

  const base = `/account/${account.id}`

  return (
    <Container>
      {muxedAddress && (
        <Row>
          <MuxedAccountInfoCard address={muxedAddress} />
        </Row>
      )}
      <Row>
        <AccountSummaryCard
          account={account}
          accountUrl={`${horizonURL}accounts/${account.id}`}
          federatedAddress={federatedAddress}
          knownAccounts={knownAccounts}
        />
      </Row>
      <Row>
        <nav id="account-nav">
          <TabLink base={base} activeTab={activeTab} title="Balances" />
          <TabLink base={base} activeTab={activeTab} title="Payments" />
          <TabLink base={base} activeTab={activeTab} title="Offers" />
          <TabLink base={base} activeTab={activeTab} title="Trades" />
          <TabLink base={base} activeTab={activeTab} title="Effects" />
          <TabLink base={base} activeTab={activeTab} title="Operations" />
          <TabLink
            base={base}
            activeTab={activeTab}
            title="Transactions"
            path="txs"
          />
          <TabLink base={base} activeTab={activeTab} title="Signing" />
          <TabLink base={base} activeTab={activeTab} title="Flags" />
          <TabLink base={base} activeTab={activeTab} title="Data" />
        </nav>
        <div id="account-tab-content">
          <Outlet />
        </div>
      </Row>
    </Container>
  )
}
