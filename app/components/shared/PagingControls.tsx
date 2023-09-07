import { MouseEventHandler } from "react"
import { FormattedMessage } from "react-intl"

interface PagingControlsProps {
  handleClickNext: MouseEventHandler<HTMLElement>
  handleClickPrev: MouseEventHandler<HTMLElement>
  hidePrev: boolean
}

const PagingControls = ({
  handleClickNext,
  handleClickPrev,
  hidePrev
}: PagingControlsProps) =>
(
  <div id="paging-controls">
    {!hidePrev && (
      <button onClick={handleClickPrev}>
        &larr; <FormattedMessage id="paging.prev" />
      </button>
    )}

    <button onClick={handleClickNext} style={{ float: 'right' }}>
      <FormattedMessage id="paging.next" /> &rarr;
    </button>
  </div>
)


export default PagingControls
