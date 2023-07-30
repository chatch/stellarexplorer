
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import FormControl from "react-bootstrap/FormControl"
import InputGroup from "react-bootstrap/InputGroup"
import Modal from "react-bootstrap/Modal"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faInfo } from "@fortawesome/free-solid-svg-icons"

import { useIntl } from "react-intl"
import { redirect } from "react-router-dom"

import { searchStrToPath } from "./lib/search"
import { isSecretKey } from "./lib/stellar/utils"
import { useState } from "react"

const HelpModal = ({ showHelp, handleCloseFn }: { showHelp: boolean, handleCloseFn: () => void }) => (
  <Modal id="help-modal" showHelp={showHelp} onHide={handleCloseFn}>
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-lg" style={{ color: "#dce2ec" }}>
        Search Help
      </Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ color: "#96a2b4" }}>
      <h4>Search By:</h4>
      <br />
      <div>
        <h5>Stellar Address</h5>
        Also called a{" "}
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
      <div>
        <h5>Account ID</h5>
        Also called a Public Key or Public Address
        <img
          src="/search/search_account_public.png"
          alt="search by public account address"
          width="100%"
        />
      </div>
      <div>
        <h5>Transaction Hash</h5>
        <img
          src="/search/search_tx_hash.png"
          alt="search by transaction hash"
          width="100%"
        />
      </div>
      <div>
        <h5>Contract Address or Hash</h5>
        <img
          src="/search/search_contract.png"
          alt="search by contract address"
          width="100%"
        />
      </div>
      <div>
        <h5>Ledger</h5>
        <img
          src="/search/search_ledger.png"
          alt="search by ledger"
        />
      </div>
      <div>
        <h5>Anchor Name</h5>
        <div>
          as listed on the{" "}
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
          Full name:
          <br />
          <img
            src="/search/search_anchor_name_full.png"
            alt="search by anchor full name"
          />
        </div>
        <div style={{ marginTop: 20 }}>
          Partial name:
          <br />
          <img
            src="/search/search_anchor_name_partial.png"
            alt="search by anchor partial name"
          />
        </div>
      </div>
      <div>
        <h5>Asset Code</h5>
        <img
          src="/search/search_asset.png"
          alt="search by asset code"
        />
      </div>
      <hr />
      <h4>OpenSearch:</h4>
      <div>
        Stellar Explorer supports{" "}
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

  const handleCloseFn = () => setShowHelp(false)
  const handleClickFn = (event: any) => {
    event.preventDefault()
    setShowHelp(true)
  }

  const searchHandler = (event: any) => {
    event.preventDefault()
    const matchPath = searchStrToPath(searchStr)

    if (matchPath == null)
      return

    redirect(matchPath)

    // #62 security: clear search box if user put the secret key there
    if (isSecretKey(searchStr)) {
      setSearchStr("")
    }
  }

  return (
    <Container>
      <Row>
        <Col id="Search-Container">
          <form onSubmit={searchHandler}>
            <InputGroup>
              <FormControl
                type="text"
                onChange={(e) => setSearchStr(e.target.value)}
                placeholder={formatMessage({
                  id: "search.placeHolder",
                })}
                value={searchStr}
              />
              <InputGroup.Text>
                <FontAwesomeIcon
                  icon={faSearch}
                  onClick={searchHandler}
                />
              </InputGroup.Text>
              <InputGroup.Text>
                <FontAwesomeIcon
                  icon={faInfo}
                  className="info-icon"
                  onClick={handleClickFn}
                />
              </InputGroup.Text>
            </InputGroup>
          </form>
          {showHelp && (
            <HelpModal
              handleCloseFn={handleCloseFn}
              showHelp={showHelp}
            />
          )}
        </Col>
      </Row>
    </Container>
  )
}