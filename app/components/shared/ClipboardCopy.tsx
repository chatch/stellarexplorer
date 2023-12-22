import { useState } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import clipSvg from '../../../public/clipboard.svg'
const TooltipCopy = <Tooltip id="tooltip-copy">Copy to Clipboard</Tooltip>
const TooltipCopied = (
  <Tooltip id="tooltip-copied" className="in">
    Copied!
  </Tooltip>
)

function ClipboardCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopyFn = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 10000)
  }
  return (
    <OverlayTrigger delay={300} overlay={copied ? TooltipCopied : TooltipCopy}>
      <img
        src={clipSvg}
        alt="clipboard"
        onClick={handleCopyFn}
        className="clipboard-icon"
      />
    </OverlayTrigger>
  )
}

export default ClipboardCopy
