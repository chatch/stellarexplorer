import type { MouseEventHandler } from 'react'
import { FormattedMessage } from 'react-intl'

interface PagingControlsProps {
  handleClickNext: MouseEventHandler<HTMLElement>
  handleClickPrev: MouseEventHandler<HTMLElement>
  hidePrev: boolean
}

const PagingControls = ({
  handleClickNext,
  handleClickPrev,
  hidePrev,
}: PagingControlsProps) => (
  <div
    id="paging-controls"
    className={`${hidePrev ? 'paging-buttons-right' : 'paging-buttons'}`}
  >
    {!hidePrev && (
      <button onClick={handleClickPrev}>
        &larr; <FormattedMessage id="paging.prev" />
      </button>
    )}

    <button onClick={handleClickNext}>
      <FormattedMessage id="paging.next" /> &rarr;
    </button>
  </div>
)

export default PagingControls
