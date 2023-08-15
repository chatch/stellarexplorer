import { MouseEventHandler } from "react"
import Pagination from "react-bootstrap/Pagination"
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
}: PagingControlsProps) => (
  <Pagination>
    {!hidePrev && (
      <Pagination.Prev onClick={handleClickPrev} href="#">
        &larr; <FormattedMessage id="paging.prev" />
      </Pagination.Prev>
    )}
    <Pagination.Next
      // next 
      onClick={handleClickNext}
      href="#">
      <FormattedMessage id="paging.next" /> &rarr;
    </Pagination.Next>
  </Pagination>
)

export default PagingControls
