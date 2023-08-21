import { useState } from "react"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
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
    navigator.clipboard.writeText(text).then(res => console.log(`res: ${res}`)).catch(error => console.error(error))
    setCopied(true)
    setTimeout(() => setCopied(false), 10000)
  }

  return (
    <OverlayTrigger
      delay={300}
      overlay={copied ? TooltipCopied : TooltipCopy}
    >
      <img
        src={clipSvg}
        alt="clipboard"
        onClick={handleCopyFn}
        style={{ color: 'white', height: 14, width: 14, marginLeft: 10 }}
      />
    </OverlayTrigger>
  )
}

export default ClipboardCopy
