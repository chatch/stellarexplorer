import type { MouseEventHandler } from 'react'
import { useEffect, useState } from 'react'
import JSONPretty from 'react-json-pretty'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Spinner } from 'react-bootstrap'

import NewWindowIcon from './NewWindowIcon'

type FilterFn = (data: any) => string

interface BackendResourceBadgeButtonWithResourceModalProps {
  filterFn?: FilterFn
  label: string
  url: string
}

interface BackendResourceBadgeButtonProps {
  handleClickFn: MouseEventHandler<HTMLAnchorElement>
  label: string
}

interface FetchDataResponse {
  textRaw: string
  isJson: boolean
}

interface ResourceModalProps {
  filterFn?: FilterFn
  handleCloseFn: () => void
  url: string
}

/**
 * Support filtering JSON responses.
 *
 * If filterFn property is a function then run it on the records[] in the
 * response.
 */
const filterRecords = (
  rspText: string,
  isJson: boolean,
  filterFn?: FilterFn,
) => {
  let text = rspText
  if (isJson === true && typeof filterFn === 'function') {
    const records = JSON.parse(rspText)['_embedded'].records
    text = filterFn(records)
    // if not found then revert to the original source
    if (text == null) text = rspText
  }
  return text
}

const isJsonResponse = (rsp: Response, url: string) =>
  url.endsWith('.json') ||
  (rsp.headers.has('content-type') &&
    rsp.headers.get('content-type')?.indexOf('json') !== -1)

const fetchData = (url: string): Promise<FetchDataResponse> =>
  fetch(url)
    .then((rsp) => Promise.all([rsp.text(), isJsonResponse(rsp, url)]))
    .then((result) => ({ textRaw: result[0], isJson: result[1] }))

/**
 * Button that reveals a backend resouce at 'url' when clicked.
 *
 * Used to show the underlying JSON that a view was rendered with OR for
 * showing a related resource, eg. an anchor's server.toml file.
 */
const BackendResourceBadgeButton = ({
  handleClickFn,
  label,
}: BackendResourceBadgeButtonProps) => (
  <a className="backend-resource-badge-button" onClick={handleClickFn}>
    {label}
  </a>
)

const ClipboardCopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)
  const handleClickCopyFn = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
  }
  return (
    <span>
      <Button
        style={{ backgroundColor: '#08b5e5', color: 'white', border: 0 }}
        onClick={handleClickCopyFn}
      >
        Copy
      </Button>
      {copied && <span style={{ marginLeft: 5 }}>Copied!</span>}
    </span>
  )
}

const ResourceModalBody = ({
  filterFn,
  url,
  text,
  setText,
}: Omit<ResourceModalProps, 'handleCloseFn'> & {
  text: string
  setText: Function
}) => {
  const [isJson, setIsJson] = useState(false)

  useEffect(() => {
    fetchData(url).then((result: FetchDataResponse) => {
      setIsJson(result.isJson)
      setText(filterRecords(result.textRaw, result.isJson, filterFn))
    })
  }, [url])

  return (
    <div>
      <div id="backend-resource-url" className="break">
        <a href={url} target="_blank" rel="noreferrer">
          {url}
          <NewWindowIcon />
        </a>
      </div>
      <div>
        {!text && <Spinner />}
        {text &&
          text.length > 0 &&
          (isJson ? (
            <JSONPretty id="json-pretty" json={text} />
          ) : (
            <pre id="plain-text">{text}</pre>
          ))}
      </div>
    </div>
  )
}

const ResourceModal = ({
  handleCloseFn,
  filterFn,
  url,
}: ResourceModalProps) => {
  const [text, setText] = useState('')
  return (
    <Modal id="resourceModal" show onHide={handleCloseFn}>
      <Modal.Header closeButton>
        <ClipboardCopyButton text={text} />
      </Modal.Header>
      <Modal.Body>
        <ResourceModalBody
          url={url}
          filterFn={filterFn}
          text={text}
          setText={setText}
        />
      </Modal.Body>
    </Modal>
  )
}

export default function BackendResourceBadgeButtonWithResourceModal({
  filterFn,
  label,
  url,
}: BackendResourceBadgeButtonWithResourceModalProps) {
  const [show, setShow] = useState(false)

  const handleCloseFn = () => setShow(false)
  const handleClickFn = () => setShow(true)

  return (
    <span>
      <BackendResourceBadgeButton label={label} handleClickFn={handleClickFn} />
      {show && (
        <ResourceModal
          filterFn={filterFn}
          handleCloseFn={handleCloseFn}
          url={url}
        />
      )}
    </span>
  )
}
