import { useState } from "react"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
import CopyToClipboard from "react-copy-to-clipboard"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-solid-svg-icons"

const CopyIcon = (
  <FontAwesomeIcon icon={faCopy} style={{ fontSize: "small", marginLeft: 5 }} />
)
const TooltipCopy = <Tooltip id="tooltip-copy">Copy to Clipboard</Tooltip>
const TooltipCopied = (
  <Tooltip id="tooltip-copied" className="in">
    Copied!
  </Tooltip>
)

function ClipboardCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopyFn = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 10000)
  }

  return (
    <OverlayTrigger
      delay={300}
      // onMouseOut={handleMouseOutFn}
      overlay={copied ? TooltipCopied : TooltipCopy}
    >
      <CopyToClipboard text={text} onCopy={handleCopyFn}>
        {CopyIcon}
      </CopyToClipboard>
    </OverlayTrigger>
  )
}

export default ClipboardCopy
