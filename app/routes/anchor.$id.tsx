import { Card, Container, Row, Table } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import AccountLink from '../components/shared/AccountLink'
import ClipboardCopy from '../components/shared/ClipboardCopy'
import Logo from '../components/shared/Logo'
import NewWindowIcon from '../components/shared/NewWindowIcon'
import StellarTomlBadge from '../components/shared/StellarTomlBadge'

import { assetKeyToIssuer, setTitle } from '../lib/utils'

import type { DirectoryAnchor } from '../data/directory'
import directory from '../data/directory'
import type { LoaderFunctionArgs } from '~/lib/remix-shim'
import { useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'
const { anchors } = directory

export const clientLoader = ({ params }: LoaderFunctionArgs) => {
  return params.id ? anchors[params.id] : null
}

export default function Anchor() {
  const { name, displayName, website, assets }: DirectoryAnchor = useLoaderData<
    typeof clientLoader
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
          <Card.Header>
            <span>
              {formatMessage({ id: 'anchor' })}{' '}
              <span className="secondary-heading">{name}</span>
            </span>
          </Card.Header>
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
