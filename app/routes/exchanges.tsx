import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { FormattedMessage, useIntl } from 'react-intl'
import isEmpty from 'lodash/isEmpty'

import { decentralized, centralized } from '../data/exchanges'
import { setTitle } from '../lib/utils'
import AccountLink from '../components/shared/AccountLink'
import Logo from '../components/shared/Logo'
import NewWindowIcon from '../components/shared/NewWindowIcon'
import { TitleWithJSONButton } from '~/components/shared/TitleWithJSONButton'
import { useEffect } from 'react'

const METADATA_URI =
  'https://raw.githubusercontent.com/chatch/stellarexplorer/master/src/data/exchanges.json'

interface ExchangeProps {
  accounts?: ReadonlyArray<string>
  home: string
  name: string
  decentralized?: boolean
  showImage?: boolean
}

const Exchange = ({
  accounts,
  home,
  name,
  showImage = true,
  decentralized = false,
}: ExchangeProps) => {
  const homeLink = `https://${home}`
  return (
    <tr className="directoryRow">
      {showImage ? (
        <td>
          <a href={homeLink} target="_blank" rel="noreferrer">
            <Logo name={name} type="exchange" />
          </a>
        </td>
      ) : null}
      <td>
        <a href={homeLink} target="_blank" rel="noreferrer">
          {home}
          <NewWindowIcon />
        </a>
      </td>
      <td>
        {accounts?.map((account) => (
          <span key={account}>
            <AccountLink account={account} hideKnown={true} />
            &nbsp;
          </span>
        ))}
        {isEmpty(accounts) && decentralized && <span>Decentralized</span>}
      </td>
    </tr>
  )
}

const TableHeader = ({ showImage = true }: { showImage?: boolean }) => (
  <thead>
    <tr>
      {showImage && <th />}
      <th>
        <FormattedMessage id="home.domain" />
      </th>
      <th>
        <FormattedMessage id="account" />
      </th>
    </tr>
  </thead>
)

export default function Exchanges() {
  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle('Exchanges')
  }, [])
  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <TitleWithJSONButton
              title={formatMessage({ id: 'exchanges' })}
              url={METADATA_URI}
            />
          </CardHeader>
          <Card.Body>
            <h6 style={{ textDecoration: 'underline' }}>Decentralized</h6>
            <Table id="dex-table">
              <TableHeader />
              <tbody>
                <tr>
                  <td />
                  <td />
                  <td />
                </tr>
                {Object.keys(decentralized).map((id) => (
                  <Exchange
                    key={id}
                    name={id}
                    {...decentralized[id]}
                    decentralized
                  />
                ))}
              </tbody>
            </Table>

            <h6 style={{ marginTop: 70, textDecoration: 'underline' }}>
              Centralized
            </h6>
            <Table id="cex-table">
              <TableHeader showImage={false} />
              <tbody>
                {Object.keys(centralized).map((id) => (
                  <Exchange
                    key={id}
                    name={id}
                    {...centralized[id]}
                    showImage={false}
                  />
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
