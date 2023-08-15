import React, { useState, type MouseEventHandler } from "react"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import CardHeader from 'react-bootstrap/CardHeader'
import Row from "react-bootstrap/Row"
import Table from "react-bootstrap/Table"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import { FormattedMessage, useIntl } from "react-intl"
import { StrKey } from "../lib/stellar/sdk"
import has from "lodash/has"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfo } from "@fortawesome/free-solid-svg-icons"

import type { KnownAccountProps } from "../data/known_accounts"
import knownAccounts from "../data/known_accounts"
import { base64Decode, setTitle } from "../lib/utils"
import { titleWithJSONButton } from "../components/shared/TitleWithJSONButton"

import AccountLink from "../components/shared/AccountLink"
import Asset from "../components/shared/Asset"
import ClipboardCopy from "../components/shared/ClipboardCopy"
// import EffectTable from "../components/EffectTable"
import FormattedAmount from "../components/shared/FormattedAmount"
import Logo from "../components/shared/Logo"
// import OperationTable from "../components/OperationTable"
// import OfferTable from "../components/OfferTable"
// import PaymentTable from "../components/PaymentTable"
// import TradeTable from "../components/TradeTable"
// import TransactionTable from "../components/TransactionTable"
import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { requestToServer } from "~/lib/stellar/server"
import type { LoadAccountResult } from "~/lib/stellar/server_request_utils"
import { loadAccount } from "~/lib/stellar/server_request_utils"
import type { Horizon, ServerApi } from "stellar-sdk"
import { useLoaderData } from "@remix-run/react"
import type { AccountRecordSigners } from "stellar-sdk/lib/types/account"

// exists in @types/react-bootstrap however can't seem to resolve it
// when importing it from react-bootstrap (compiler should find it).
// so dupliating it partially here:
export interface SelectCallback extends React.EventHandler<any> {
  (eventKey: any, e: React.SyntheticEvent<{}>): void
}

const dataValue = (decodeValue: boolean, value?: any,): string => {
  let retVal
  if (typeof value === "boolean") {
    retVal = value.toString()
  } else if (decodeValue) {
    retVal = base64Decode(value)
  } else {
    retVal = value
  }
  return retVal
}

const NameValueTable = ({
  data,
  decodeValue = false
}: {
  data: Record<string, any>,
  decodeValue?: boolean
}) => {
  if (!data || Object.keys(data).length === 0)
    return <div style={{ marginTop: 20, marginBottom: 20 }}>No Data</div>
  return (
    <Table>
      <thead>
        <tr>
          <th>
            <FormattedMessage id="name" />
          </th>
          <th>
            <FormattedMessage id="value" />
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(data).map((key) => (
          <tr key={key}>
            <td>{key}</td>
            <td>
              {dataValue(decodeValue, data[key])}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

type Balance = Pick<Horizon.BalanceLineAsset,
  'asset_code' |
  'asset_issuer' |
  'asset_type' |
  'balance' |
  'limit'
>

const balanceRow = ({
  asset_code,
  asset_issuer,
  asset_type,
  balance,
  limit,
}: Balance) => (
  <tr key={asset_code ? `${asset_code}-${asset_issuer}` : "XLM"}>
    <td>
      <Asset
        type={asset_type}
        code={asset_code}
        issuer={asset_issuer}
      />
    </td>
    <td>
      <span className="break">
        <FormattedAmount amount={balance} />
      </span>
    </td>
    <td>
      <span className="break">{limit}</span>
    </td>
  </tr>
)

const Balances = ({ balances }: { balances: ReadonlyArray<Balance> }) => (
  <Table>
    <thead>
      <tr>
        <th>
          <FormattedMessage id="asset" />
        </th>
        <th>
          <FormattedMessage id="balance" />
        </th>
        <th>
          <FormattedMessage id="limit" />
        </th>
      </tr>
    </thead>
    <tbody>{balances.map(balanceRow)}</tbody>
  </Table>
)

const Thresholds = ({ thresholds }: { thresholds: Horizon.AccountThresholds }) => (
  <Table>
    <thead>
      <tr>
        <th>
          <FormattedMessage id="threshold.low" />
        </th>
        <th>
          <FormattedMessage id="threshold.medium" />
        </th>
        <th>
          <FormattedMessage id="threshold.high" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{thresholds.low_threshold}</td>
        <td>{thresholds.med_threshold}</td>
        <td>{thresholds.high_threshold}</td>
      </tr>
    </tbody>
  </Table>
)

const Signers = ({ signers }: { signers: AccountRecordSigners[] }) => (
  <Table>
    <thead>
      <tr>
        <th>
          <FormattedMessage id="key" />
        </th>
        <th>
          <FormattedMessage id="weight" />
        </th>
        <th>
          <FormattedMessage id="type" />
        </th>
      </tr>
    </thead>
    <tbody>
      {signers.map((signer) => (
        <tr key={signer.key}>
          <td>
            {signer.type === "ed25519_public_key" && (
              <AccountLink account={signer.key} />
            )}
            {signer.type === "sha256_hash" &&
              StrKey.decodeSha256Hash(signer.key).toString("hex")}
            {signer.type === "preauth_tx" &&
              StrKey.decodePreAuthTx(signer.key).toString("hex")}
          </td>
          <td>{signer.weight}</td>
          <td>{signer.type}</td>
        </tr>
      ))}
    </tbody>
  </Table>
)

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

const Flags = ({ flags }: { flags: Record<string, any> }) =>
  <NameValueTable data={flags} />
const Data = ({ data }: { data: Record<string, any> }) =>
  <NameValueTable data={data} decodeValue />

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

  setTitle(`Account ${account.id}`)

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

// const handleURIHash = () => {
//   if (has(window.location, "hash") && window.location.hash.length > 1) {
//     const tab = window.location.hash.substring(1) // string after '#'
//     this.setNewState(tab)
//   }
// }

const handleTabSelect = (
  setTabKey: React.Dispatch<React.SetStateAction<string>>,
  setRenderEffectsFlag: React.Dispatch<React.SetStateAction<boolean>>
): SelectCallback => (key: string): void => {
  window.location.hash = `#${key}`

  // switch on render effects flag when user navigates to the effects tab.
  // result of this a lazy load of effects only when required.
  // no logic to ever switch this off as once loaded they stay loaded
  if (key === 'effects') {
    setRenderEffectsFlag(true)
  }

  setTabKey(key)
}

export default function Account() {
  const accountResult: LoadAccountResult = useLoaderData<typeof loader>() as LoadAccountResult

  const { formatMessage } = useIntl()

  const [renderEffects, setRenderEffectsFlag]: [
    renderEffects: boolean,
    setRenderEffectsFlag: React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false)
  const [tabKey, setTabKey]: [
    tabKey: string,
    setTabKey: React.Dispatch<React.SetStateAction<string>>
  ] = useState('balances')

  const { account, muxedAddress, federatedAddress } = accountResult

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
      <Row>
        <Tabs
          id="account-tabs"
          activeKey={tabKey}
          onSelect={handleTabSelect(setTabKey, setRenderEffectsFlag)}
          style={{ border: "1px solid #ddd", borderRadius: 4 }}
        >
          <Tab eventKey="balances" title={formatMessage({ id: "balances" })}>
            <Balances balances={account.balances as ReadonlyArray<Balance>} />
          </Tab>
          <Tab eventKey="payments" title={formatMessage({ id: "payments" })}>
            {/* <PaymentTable
              key={account.id}
              account={account.id}
              compact={false}
              limit={20}
              usePaging
            /> */}
          </Tab>
          <Tab eventKey="offers" title={formatMessage({ id: "offers" })}>
            {/* <OfferTable
              key={account.id}
              account={account.id}
              compact={false}
              limit={20}
              showSeller={false}
              usePaging
            /> */}
          </Tab>
          <Tab eventKey="trades" title={formatMessage({ id: "trades" })}>
            {/* <TradeTable
              key={account.id}
              account={account.id}
            // limit={20}
            // usePaging
            /> */}
          </Tab>
          <Tab eventKey="effects" title={formatMessage({ id: "effects" })}>
            {
              // OPTIMISATION: render on focus only as it hits the server for every effect
              // renderEffects === true && (
              //   <EffectTable
              //     key={account.id}
              //     account={account.id}
              //     // limit={20}
              //     showAccount={false}
              //   // usePaging
              //   />
              // )
            }
          </Tab>
          <Tab
            eventKey="operations"
            title={formatMessage({ id: "operations" })}
          >
            {/* <OperationTable
              key={account.id}
              account={account.id}
              compact={false}
              limit={20}
              usePaging
            /> */}
          </Tab>
          <Tab
            eventKey="transactions"
            title={formatMessage({ id: "transactions" })}
          >
            {/* <TransactionTable
              key={account.id}
              account={account.id}
              compact={false}
              limit={20}
              showSource={false}
              usePaging
            /> */}
          </Tab>
          <Tab eventKey="signing" title={formatMessage({ id: "signing" })}>
            <Row>
              <Col md={7}>
                <Signers signers={account.signers} />
              </Col>
              <Col
                md={3}
                mdOffset={1}
                style={{ border: "1px solid white", marginTop: 30 }}
              >
                <h4>
                  <FormattedMessage id="thresholds" />
                </h4>
                <Thresholds thresholds={account.thresholds} />
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="flags" title={formatMessage({ id: "flags" })}>
            <Flags flags={account.flags} />
          </Tab>
          <Tab eventKey="data" title={formatMessage({ id: "data" })}>
            <Data data={account.data_attr} />
          </Tab>
        </Tabs>
      </Row>
    </Container>
  )
}

