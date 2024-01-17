import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Modal from 'react-bootstrap/Modal'

import { useIntl } from 'react-intl'

import { searchStrToPath } from './lib/search'
import { isSecretKey } from './lib/stellar/utils'
import { useState } from 'react'
import { useLocation, useNavigate } from '@remix-run/react'

import searchSvg from '../public/search.svg'
import infoCircleSvg from '../public/info-circle.svg'
import { isPathClaimableBalance } from './lib/utilities'

const HelpModal = ({
  showHelp,
  handleCloseFn,
}: {
  showHelp: boolean
  handleCloseFn: () => void
}) => (
  <Modal id="help-modal" show={showHelp} onHide={handleCloseFn}>
    <Modal.Header closeButton>
      <Modal.Title>Search Help</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ color: '#96a2b4' }}>
      <div>
        <div className="search-sub-heading">Stellar Address</div>
        <div className="search-desc">
          Also called a{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.stellar.org/developers/guides/concepts/federation.html#stellar-addresses"
          >
            Stellar federated address
          </a>
          <img
            src="/search/search_stellar_address.png"
            alt="search by ledger"
          />
        </div>
      </div>
      <div>
        <div className="search-sub-heading">Account ID</div>
        <div className="search-desc">
          Also called a Public Key or Public Address
          <img
            src="/search/search_account_public.png"
            alt="search by public account address"
            width="100%"
          />
        </div>
      </div>
      <div>
        <div className="search-sub-heading">Transaction Hash</div>
        <img
          src="/search/search_tx_hash.png"
          alt="search by transaction hash"
          width="100%"
        />
      </div>
      <div>
        <div className="search-sub-heading">Contract Address or Hash</div>
        <img
          src="/search/search_contract.png"
          alt="search by contract address"
          width="100%"
        />
      </div>
      <div>
        <div className="search-sub-heading">Ledger</div>
        <img src="/search/search_ledger.png" alt="search by ledger" />
      </div>
      <div className="search-sub-heading">Anchor Name</div>
      <div>
        <div className="search-desc">
          as listed on the{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://steexp.com/anchors"
          >
            Anchors Page
          </a>
        </div>
        <div>
          <br />
          <div className="search-desc">
            <div>Full name:</div>
            <img
              src="/search/search_anchor_name_full.png"
              alt="search by anchor full name"
            />
          </div>
          <br />
          <div className="search-desc">
            <div>Partial name:</div>
            <img
              src="/search/search_anchor_name_partial.png"
              alt="search by anchor partial name"
            />
          </div>
        </div>
      </div>
      <div>
        <div className="search-sub-heading">Asset Code</div>
        <img src="/search/search_asset.png" alt="search by asset code" />
      </div>
      <hr />
      <h4>OpenSearch:</h4>
      <div>
        Stellar Explorer supports{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://developer.mozilla.org/en-US/docs/Web/OpenSearch"
        >
          OpenSearch
        </a>
        . This allows you to search directly from your browser search box or
        search bar. You should see something like the following when you
        navigate to Stellar Explorer then open the search box. Install it from
        there:
        <br />
        <img
          src="https://user-images.githubusercontent.com/1477978/33513399-8cf8ac52-d774-11e7-9585-ddc5467a5a2d.png"
          alt="search by transaction hash"
          width="80%"
        />
      </div>
    </Modal.Body>
  </Modal>
)

export default function SearchBox() {
  const { formatMessage } = useIntl()

  const [searchStr, setSearchStr] = useState('')
  const [showHelp, setShowHelp] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const placeHolderI18nId = isPathClaimableBalance(location.pathname)
    ? 'search.placeHolder.claimableBalance'
    : 'search.placeHolder'

  const showMessage = () => {
    return isPathClaimableBalance(location.pathname) ? (
      <p>{formatMessage({ id: 'search.message.claimableBalance' })}</p>
    ) : (
      ''
    )
  }

  const handleCloseFn = () => setShowHelp(false)
  const handleClickFn = () => setShowHelp(true)

  const searchHandler = (event: any, pathName: string) => {
    console.log(`searchHandler entry [${searchStr}]`)
    event.preventDefault()

    const matchPath = searchStrToPath(searchStr, pathName)
    console.log(`matchPath ${matchPath}`)

    // #62 security: clear search box if user put the secret key there
    if (isSecretKey(searchStr)) {
      setSearchStr('')
    }

    if (matchPath == null) return

    return navigate(matchPath)
  }

  return (
    <Container>
      <Row>
        <Col id="search-container">
          <form onSubmit={(event) => searchHandler(event, location.pathname)}>
            <InputGroup>
              <FormControl
                type="text"
                onChange={(e) => setSearchStr(e.target.value)}
                placeholder={formatMessage({ id: placeHolderI18nId })}
                value={searchStr}
              />
              <InputGroup.Text>
                <img
                  src={searchSvg}
                  style={{ color: '#4c5667', height: 16, width: 16 }}
                  onClick={(event) => searchHandler(event, location.pathname)}
                />
              </InputGroup.Text>
              <InputGroup.Text
                style={{
                  background: 'none',
                  border: 0,
                  color: 'white',
                  fontSize: 20,
                }}
              >
                <img
                  src={infoCircleSvg}
                  alt="search info"
                  className="info-icon"
                  onClick={handleClickFn}
                />
              </InputGroup.Text>
            </InputGroup>
          </form>
          {showHelp && (
            <HelpModal handleCloseFn={handleCloseFn} showHelp={showHelp} />
          )}
        </Col>
        {showMessage()}
      </Row>
    </Container>
  )
}
