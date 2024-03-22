import { useLoaderData, useParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { StrKey } from '../lib/stellar/sdk'
import type { Horizon } from 'stellar-sdk'
import AccountLink from '~/components/shared/AccountLink'
import type { HorizonServerDetails } from '~/lib/stellar/server'
import HorizonServer, { requestToServerDetails } from '~/lib/stellar/server'
import type { LoadAccountResult } from '~/lib/stellar/server_request_utils'
import { loadAccount } from '~/lib/stellar/server_request_utils'
import { setTitle } from '~/lib/utils'
import type { AccountRecordSigners } from 'stellar-sdk/lib/types/account'
import type { LoaderFunctionArgs } from '@remix-run/node'

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
export const loader = ({ request }: LoaderFunctionArgs) =>
  requestToServerDetails(request)

export default function SigningTab() {
  const serverDetails = useLoaderData<typeof loader>() as HorizonServerDetails
  const [accountResult, setAccountResult]: [LoadAccountResult | null, any] =
    useState(null)
  const { accountId } = useParams()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTitle(`Account Signing ${accountId}`)
      const server = new HorizonServer(
        serverDetails.serverAddress,
        serverDetails.networkType as string,
      )
      loadAccount(server, accountId as string).then(setAccountResult)
    }
  }, [accountId])

  if (!accountResult) {
    return
  }

  const { account } = accountResult as any

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
