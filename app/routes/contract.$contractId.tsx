import { Link } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData, useLocation, useParams } from '@remix-run/react'

import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'

import { requestToSorobanServer } from '~/lib/stellar/server'
import { TitleWithJSONButton } from '~/components/shared/TitleWithJSONButton'
import ClipboardCopy from '~/components/shared/ClipboardCopy'
import { useEffect, useState } from 'react'
import { loadContract } from '~/lib/stellar/contracts'
import { ErrorBoundary } from './lib/error-boundary'
import ContractIdInvalid from '~/lib/error/ContractIdInvalid'
import { captureException } from '@sentry/remix'
import { saveAs } from '~/lib/filesaver'
import { hexStringToBytes } from '~/lib/utils'
import TabLink from './lib/tab-link-base'

const pathToTabName = (path: string) => {
  const match = /\/contract\/[^/]*\/([a-z,-]*)/.exec(path)
  return match ? match[1] : 'storage'
}

const saveWasmFile = (contractId: string, wasmHexString: string) =>
  saveAs(
    new Blob([hexStringToBytes(wasmHexString)], {
      type: 'application/octet-stream',
    }),
    `soroban-contract-${contractId}.wasm`,
  )

const DetailRow = ({ label, children }: { label: string; children: any }) => (
  <tr>
    <td>
      <FormattedMessage id={label} />
    </td>
    <td>{children}</td>
  </tr>
)

export { ErrorBoundary }

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const server = await requestToSorobanServer(request)
  let response
  try {
    response = await Promise.all([
      loadContract(server, params.contractId as string),
      server.serverURL.toString(),
    ]).then((result) => ({
      contractDetails: result[0],
      horizonURL: result[1],
    }))
  } catch (error) {
    if (error instanceof ContractIdInvalid) {
      throw new Response(null, {
        status: 400,
        statusText: error.message,
      })
    } else {
      captureException(error)
      throw error
    }
  }
  return json(response)
}

export default function ContractById() {
  const { formatMessage } = useIntl()
  const [activeTab, setActiveTab] = useState('storage')
  const { pathname } = useLocation()
  const { contractDetails } = useLoaderData<typeof loader>()
  const { contractId } = useParams()

  useEffect(() => {
    setActiveTab(pathToTabName(pathname))
  }, [pathname])

  if (!contractDetails) {
    return (
      <Container>
        <span>Contract {contractId} not found</span>
      </Container>
    )
  }

  const { id, wasmCode, wasmId, wasmIdLedger, wasmCodeLedger } = contractDetails

  const base = `/contract/${id}`

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <TitleWithJSONButton
              title={formatMessage({ id: 'contract' })}
              titleSecondary={id}
              // TODO: consider what to show here. With contracts there
              // is no single JSON source, a couple of look ups are
              // made .. for now not passing the URL means no JSON
              // button is rendered at all:
              // url={`${horizonURL}contracts/${id}`}
            />
          </CardHeader>
          <Card.Body>
            <Table>
              <tbody>
                <DetailRow label="contract.create.ledger">
                  <Link to={`/ledger/${wasmIdLedger}`}>{wasmIdLedger}</Link>
                </DetailRow>
                <DetailRow label="contract.wasm.upload.ledger">
                  <Link to={`/ledger/${wasmCodeLedger}`}>{wasmCodeLedger}</Link>
                </DetailRow>
                <DetailRow label="contract.wasm.id">
                  <span>
                    {wasmId}
                    <ClipboardCopy text={wasmId} />
                  </span>
                </DetailRow>
                <DetailRow label="contract.wasm.bytecode">
                  <button
                    className="backend-resource-badge-button"
                    onClick={() => saveWasmFile(id, wasmCode)}
                    style={{ border: 0, marginTop: '10px' }}
                  >
                    <FormattedMessage id="contract.wasm.download" />
                  </button>
                </DetailRow>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Row>

      <Row>
        <nav id="contract-nav">
          <TabLink base={base} activeTab={activeTab} title="Storage" />
          <TabLink base={base} activeTab={activeTab} title="Interface" />
          <TabLink
            base={base}
            activeTab={activeTab}
            title="Code (readable)"
            path="code-readable"
          />
          <TabLink
            base={base}
            activeTab={activeTab}
            title="Code (wat)"
            path="code-wat"
          />
        </nav>
        <div id="contract-tab-content">
          <Outlet context={contractDetails} />
        </div>
      </Row>
    </Container>
  )
}
