import React, { type MouseEventHandler, useEffect } from "react"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import CardHeader from 'react-bootstrap/CardHeader'
import Row from "react-bootstrap/Row"
import { FormattedMessage, useIntl } from "react-intl"
import has from "lodash/has"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfo } from "@fortawesome/free-solid-svg-icons"

import type { KnownAccountProps } from "../data/known_accounts"
import knownAccounts from "../data/known_accounts"
import { setTitle } from "../lib/utils"
import { titleWithJSONButton } from "../components/shared/TitleWithJSONButton"

import ClipboardCopy from "../components/shared/ClipboardCopy"
import Logo from "../components/shared/Logo"
import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { requestToServer } from "~/lib/stellar/server"
import type { LoadAccountResult } from "~/lib/stellar/server_request_utils"
import { loadAccount } from "~/lib/stellar/server_request_utils"
import type { ServerApi } from "stellar-sdk"
import { NavLink, Outlet, useLoaderData } from "@remix-run/react"


// exists in @types/react-bootstrap however can't seem to resolve it
// when importing it from react-bootstrap (compiler should find it).
// so dupliating it partially here:
export interface SelectCallback extends React.EventHandler<any> {
  (eventKey: any, e: React.SyntheticEvent<{}>): void
}

const MuxedAccountInfoCard = ({ address, handleClickFn }: { address: string, handleClickFn?: MouseEventHandler<SVGSVGElement> }) => {
  return (
    <Card>
      <FontAwesomeIcon icon={faInfo} onClick={handleClickFn} />
      &nbsp; NOTE: This view shows the base account of the multiplexed account
      &nbsp;
      <span style={{ color: "white", overflowWrap: "break-word" }}>
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
  account: ServerApi.AccountRecord,
  accountUrl: string,
  federatedAddress?: string,
  knownAccounts: Record<string, KnownAccountProps>,
}) => {
  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(`Account ${account.id}`)
  }, [])
  return (
    <Card>
      <CardHeader>
        {titleWithJSONButton(
          formatMessage({ id: "account" }),
          accountUrl
        )}
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
                  <span className="break" style={{ color: "white" }}>
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
            {has(knownAccounts, account.id) && knownAccounts[account.id].logo && (
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

export const loader = ({ params, request }: LoaderArgs) => {
  const server = requestToServer(request)
  return loadAccount(server, params.accountId as string).then(json)
}

export default function Account() {
  const accountResult: LoadAccountResult =
    useLoaderData<typeof loader>() as LoadAccountResult

  const { account, muxedAddress, federatedAddress } = accountResult

  const accountUrl = `/account/${account.id}`

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
          accountUrl={`/account/${account.id}`}
          federatedAddress={federatedAddress}
          knownAccounts={knownAccounts}
        />
      </Row>
      <Row style={{ backgroundColor: '#383f4b' }}>
        <nav id="sidebar">
          <NavLink to={`${accountUrl}/balances`}>Balances</NavLink>
          <NavLink to={`${accountUrl}/payments`}>Payments</NavLink>
          <NavLink to={`${accountUrl}/offers`}>Offers</NavLink>
          <NavLink to={`${accountUrl}/trades`}>Trades</NavLink>
          <NavLink to={`${accountUrl}/effects`}>Effects</NavLink>
          <NavLink to={`${accountUrl}/operations`}>Operations</NavLink>
          <NavLink to={`${accountUrl}/txs`}>Transactions</NavLink>
          <NavLink to={`${accountUrl}/signing`}>Signing</NavLink>
          <NavLink to={`${accountUrl}/flags`}>Flags</NavLink>
          <NavLink to={`${accountUrl}/data`}>Data</NavLink>
        </nav>
        <div>
          <Outlet />
        </div>
      </Row>
    </Container>
  )
}

