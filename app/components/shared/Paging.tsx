import { MouseEventHandler } from 'react'
import PagingControls from './PagingControls'

interface PagingProps {
  usePaging?: boolean
  hidePrev?: boolean
  handleClickNext: MouseEventHandler<HTMLElement>
  handleClickPrev: MouseEventHandler<HTMLElement>
}

export default function Paging({
  usePaging = true,
  hidePrev = true,
  handleClickNext,
  handleClickPrev,
  children
}: React.PropsWithChildren<PagingProps>) {
  if (!usePaging)
    return children

  return (
    <div id="pagingwrap">
      <PagingControls
        hidePrev={hidePrev}
        handleClickNext={handleClickNext}
        handleClickPrev={handleClickPrev}
      />
      {children}
    </div>
  )
}
