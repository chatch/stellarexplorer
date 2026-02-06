import { useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
const clipSvg = '/clipboard.svg'
const TooltipCopy = <Tooltip id="tooltip-copy">Copy to Clipboard</Tooltip>
const TooltipCopied = (
  <Tooltip id="tooltip-copied" className="in">
    Copied!
  </Tooltip>
)

function ClipboardCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopyFn = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed' // Avoid scrolling to bottom
        textArea.style.left = '-9999px'
        textArea.style.top = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        if (!successful) throw new Error('Fallback copy failed')
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 10000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
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
