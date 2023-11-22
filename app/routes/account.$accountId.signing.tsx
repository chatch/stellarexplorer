import { LoaderArgs, json } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'
import { useEffect } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { StrKey } from '../lib/stellar/sdk'
import { Horizon } from 'stellar-sdk'
import AccountLink from '~/components/shared/AccountLink'
import { requestToServer } from '~/lib/stellar/server'
import {
  LoadAccountResult,
  loadAccount,
} from '~/lib/stellar/server_request_utils'
import { setTitle } from '~/lib/utils'
import { AccountRecordSigners } from 'stellar-sdk/lib/types/account'

const Thresholds = ({
  thresholds,
}: {
  thresholds: Horizon.AccountThresholds
}) => (
  <Table id="threshold-table">
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
  <Table id="signer-table">
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
            {signer.type === 'ed25519_public_key' && (
              <AccountLink account={signer.key} />
            )}
            {signer.type === 'sha256_hash' &&
              StrKey.decodeSha256Hash(signer.key).toString('hex')}
            {signer.type === 'preauth_tx' &&
              StrKey.decodePreAuthTx(signer.key).toString('hex')}
          </td>
          <td>{signer.weight}</td>
          <td>{signer.type}</td>
        </tr>
      ))}
    </tbody>
  </Table>
)

export const loader = ({ params, request }: LoaderArgs) => {
  const server = requestToServer(request)
  return loadAccount(server, params.accountId as string).then(json)
}

export default function BalancesTab() {
  const accountResult = useLoaderData<typeof loader>() as LoadAccountResult

  const { accountId } = useParams()
  useEffect(() => {
    setTitle(`Account Signing ${accountId}`)
  }, [])

  if (!accountResult) {
    return
  }

  const { account } = accountResult

  return (
    <Container>
      <Row>
        <Col md={7}>
          <Signers signers={account.signers} />
        </Col>
        <Col
          md={{ span: 3, offset: 1 }}
          style={{ border: '1px solid white', marginTop: 30 }}
        >
          <h4>
            <FormattedMessage id="thresholds" />
          </h4>
          <Thresholds thresholds={account.thresholds} />
        </Col>
      </Row>
    </Container>
  )
}
