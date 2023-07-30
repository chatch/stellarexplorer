import { MouseEventHandler, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard"
import JSONPretty from "react-json-pretty"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"

import NewWindowIcon from "./NewWindowIcon"

import FetchPonyfill from "fetch-ponyfill"

const fetch = FetchPonyfill().fetch

/**
 * Button that reveals a backend resouce at 'url' when clicked.
 *
 * Used to show the underlying JSON that a view was rendered with OR for
 * showing a related resource, eg. an anchor's server.toml file.
 */

interface BackendResourceBadgeButtonProps {
  handleClickFn: MouseEventHandler<HTMLAnchorElement>
  label: string
  url: string
};

const BackendResourceBadgeButton = ({ handleClickFn, label, url }: BackendResourceBadgeButtonProps) => (
  <a
    className="backend-resource-badge-button"
    href={url}
    onClick={handleClickFn}
  >
    {label}
  </a>
)

const ClipboardCopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)
  const handleClickCopyFn = () => setCopied(true)
  return (
    <CopyToClipboard text={text} onCopy={handleClickCopyFn}>
      <span>
        <Button
          style={{ backgroundColor: "#08b5e5", color: "white", border: 0 }}
        >
          Copy
        </Button>
        {copied && <span style={{ marginLeft: 5 }}>Copied!</span>}
      </span>
    </CopyToClipboard>
  )
}

interface ResourceModalProps {
  handleCloseFn: () => void
  isJson: boolean
  show: boolean
  text: string
  url: string
}

const ResourceModalBody = ({ isJson, text, url }: Partial<ResourceModalProps>) => (
  <div>
    <div className="break" style={{ marginBottom: 15 }}>
      <a href={url} target="_blank" rel="noreferrer">
        {url}
        <NewWindowIcon />
      </a>
    </div>
    <div>
      {isJson ? <JSONPretty id="json-pretty" json={text} /> : <pre>{text}</pre>}
    </div>
  </div>
)

const ResourceModal = ({ handleCloseFn, isJson, show, text, url }: ResourceModalProps) => (
  <Modal id="resourceModal" show={show} onHide={handleCloseFn}>
    <Modal.Header closeButton>
      <ClipboardCopyButton text={text} />
    </Modal.Header>
    <Modal.Body>
      <ResourceModalBody isJson={isJson} text={text} url={url} />
    </Modal.Body>
  </Modal>
)


interface ResourceModalContainerProps {
  handleCloseFn: () => void
  filterFn?: (data: any) => string
  label: string
  url: string
}

function ResourceModalContainer({ filterFn, handleCloseFn, label, url }: ResourceModalContainerProps) {
  const [show, setShow] = useState(false)
  const [isJson, setIsJson] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchFailed, setFetchFailed] = useState(false)
  const [text, setText] = useState("")

  const isJsonResponse = (rsp: Response) => url.endsWith(".json") ||
    (rsp.headers.has("content-type") &&
      rsp.headers.get("content-type")?.indexOf("json") !== -1)

  /**
   * Support filtering JSON responses.
   *
   * If filterFn property is a function then run it on the records[] in the
   * response.
   */
  const filter = (rspText: string, isJson: boolean) => {
    let text = rspText
    if (isJson === true && typeof filterFn === "function") {
      const records = JSON.parse(rspText)["_embedded"].records
      text = filterFn(records)
      // if not found then revert to the original source
      if (text == null) text = rspText
    }
    return text
  }

  // componentDidMount() {
  //   fetch(url)
  //     .then((rsp) => Promise.all([rsp.text(), this.isJsonResponse(rsp)]))
  //     .then(([text, isJson]) =>
  //       this.setState({
  //         text: this.filter(text, isJson),
  //         isLoading: false,
  //         isJson,
  //         show: true,
  //       })
  //     )
  //     .catch((err) => {
  //       console.error(
  //         `Failed to fetch resource [${url}] Err: [${err}]`
  //       )
  //       this.setState({
  //         fetchFailed: true,
  //         isLoading: false,
  //       })
  //     })
  // }

  if (fetchFailed) {
    return (
      <ResourceModal
        handleCloseFn={handleCloseFn}
        isJson={false}
        show={true}
        text="Fetch resource failed ... Try the link above."
        url={url}
      />
    )
  } else {
    return (
      <ResourceModal
        handleCloseFn={handleCloseFn}
        isJson={isJson}
        show={show}
        text={text}
        url={url}
      />
    )
  }
}



type BackendResourceBadgeButtonWithResourceModalProps = Omit<ResourceModalContainerProps, 'handleCloseFn'>

export default function BackendResourceBadgeButtonWithResourceModal({
  filterFn,
  label,
  url
}: BackendResourceBadgeButtonWithResourceModalProps) {
  const [show, setShow] = useState(false)

  const handleCloseFn = () => setShow(false)
  const handleClickFn = () => setShow(true)

  return (
    <span>
      <BackendResourceBadgeButton
        label={label}
        handleClickFn={handleClickFn}
        url={url}
      />
      {show && (
        <ResourceModalContainer
          filterFn={filterFn}
          handleCloseFn={handleCloseFn}
          label={label}
          // show={show}
          url={url}
        />
      )}
    </span>
  )

}
