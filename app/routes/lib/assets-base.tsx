import { useEffect } from "react"
import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import CardHeader from "react-bootstrap/CardHeader"
import Row from "react-bootstrap/Row"
import Table from "react-bootstrap/Table"
import { FormattedMessage, useIntl } from "react-intl"
import { Link } from "react-router-dom"

import { setTitle } from "../../lib/utils"
import AccountLink from "../../components/shared/AccountLink"
import BackendResourceBadgeButton from "../../components/shared/BackendResourceBadgeButton"
import ClipboardCopy from "../../components/shared/ClipboardCopy"
import Logo from "../../components/shared/Logo"
import NewWindowIcon from "../../components/shared/NewWindowIcon"
import { TitleWithJSONButton } from "~/components/shared/TitleWithJSONButton"

import directory from "../../data/directory"

const { anchors, assets } = directory
export const METADATA_URI =
  "https://raw.githubusercontent.com/irisli/stellarterm/master/directory/directory.json"

export interface AssetProps {
  code: string
  issuer: string
  domain: string
}

export function Asset({ code, domain, issuer }: AssetProps) {
  const anchor = anchors[domain]
  return (
    <tr className="directoryRow">
      <td>
        <a href={anchor.website || ''} target="_blank" rel="noreferrer">
          <Logo name={domain} type="anchor" />
        </a>
      </td>
      <td style={{ color: "white" }}>{code}</td>
      <td>
        <AccountLink account={issuer} hideKnown />
        <ClipboardCopy text={issuer} />
      </td>
      <td>
        <div>
          <Link to={`/anchor/${domain}`}>{anchor.name}</Link>
        </div>
        <div>
          <a href={anchor.website} target="_blank" rel="noreferrer">
            {anchor.website}
            <NewWindowIcon />
          </a>
        </div>
        <div className="stellarToml">
          <BackendResourceBadgeButton
            label="server.toml"
            url={`https://${domain}/.well-known/stellar.toml`}
          />
        </div>
      </td>
    </tr>
  )
};

export function Assets({ assetKeys }: { assetKeys: Array<string> }) {
  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle("Assets")
  }, [])

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <TitleWithJSONButton title={formatMessage({ id: "assets" })}
              url={METADATA_URI} />
          </CardHeader>
          <Card.Body>
            <Table id="assets-table">
              <thead>
                <tr>
                  <th />
                  <th>
                    <FormattedMessage id="code" />
                  </th>
                  <th>
                    <FormattedMessage id="issuer" />
                  </th>
                  <th>
                    <FormattedMessage id="anchor" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {assetKeys.sort().map((key) => {
                  const asset = assets[key]
                  return <Asset key={key} {...asset} />
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}