import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { FormattedMessage, useIntl } from 'react-intl'

import AccountLink from '../components/shared/AccountLink'
import ClipboardCopy from '../components/shared/ClipboardCopy'
import Logo from '../components/shared/Logo'
import NewWindowIcon from '../components/shared/NewWindowIcon'
import StellarTomlBadge from '../components/shared/StellarTomlBadge'

import { assetKeyToIssuer, setTitle } from '../lib/utils'

import type { DirectoryAnchor } from '../data/directory'
import directory from '../data/directory'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'
const { anchors } = directory

export const loader = ({ params }: LoaderFunctionArgs) => {
  return params.id ? anchors[params.id] : null
}

export default function Anchor() {
  const { name, displayName, website, assets }: DirectoryAnchor = useLoaderData<
    typeof loader
  >() as DirectoryAnchor

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(`Anchor ${name}`)
  }, [name])

  if (name == null) return null

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <span>
              {formatMessage({ id: 'anchor' })}{' '}
              <span className="secondary-heading">{name}</span>
            </span>
          </CardHeader>
          <Card.Body>
            <Table id="anchor-table">
              <tbody>
                <tr>
                  <td>
                    <a href={website} target="_blank" rel="noreferrer">
                      <Logo name={name} type="anchor" />
                    </a>
                  </td>
                  <td>
                    <div>{displayName || name}</div>
                    <div style={{ marginTop: 10 }}>
                      <a href={website} target="_blank" rel="noreferrer">
                        {website}
                        <NewWindowIcon />
                      </a>
                    </div>
                    <div style={{ marginTop: 15 }}>
                      <StellarTomlBadge domain={name} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Row>

      <Row style={{ marginLeft: 10, marginRight: 10 }}>
        <h3>
          <FormattedMessage id="assets" />
        </h3>
        <Table id="assets-table">
          <thead>
            <tr>
              <th>
                <FormattedMessage id="code" />
              </th>
              <th>
                <FormattedMessage id="issuer" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(assets)
              .sort()
              .map((code) => {
                const issuer = assetKeyToIssuer(assets[code])
                return (
                  <tr key={code}>
                    <td>{code}</td>
                    <td>
                      <AccountLink account={issuer} hideKnown />
                      <ClipboardCopy text={issuer} />
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </Table>
      </Row>
    </Container>
  )
}
