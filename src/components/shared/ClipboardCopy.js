import React from 'react'
import PropTypes from 'prop-types'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import CopyToClipboard from 'react-copy-to-clipboard'

const CopyIcon = (
  <Glyphicon glyph="copy" style={{fontSize: 'small', marginLeft: 5}} />
)
const TooltipCopy = <Tooltip id="tooltip-copy">Copy to Clipboard</Tooltip>
const TooltipCopied = (
  <Tooltip id="tooltip-copied" className="in">
    Copied!
  </Tooltip>
)

class ClipboardCopy extends React.Component {
  static defaultProps = {
    text: '',
  }

  state = {
    copied: false,
  }

  constructor(props, context) {
    super(props, context)
    this.handleCopy = this.handleCopy.bind(this)
  }

  handleCopy() {
    this.setState({copied: true})
    setTimeout(() => this.setState({copied: false}), 10000)
  }

  render() {
    return (
      <OverlayTrigger
        delayShow={300}
        onMouseOut={this.handleMouseOut}
        overlay={this.state.copied ? TooltipCopied : TooltipCopy}
      >
        <CopyToClipboard text={this.props.text} onCopy={this.handleCopy}>
          {CopyIcon}
        </CopyToClipboard>
      </OverlayTrigger>
    )
  }
}

ClipboardCopy.propTypes = {
  text: PropTypes.string,
}

export default ClipboardCopy
