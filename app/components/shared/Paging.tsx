import type { MouseEventHandler } from 'react'
import PagingControls from './PagingControls'
import { useNavigate } from '@remix-run/react'

interface PagingProps {
  usePaging?: boolean
  currentCursor?: string
  baseUrl: string
  records: ReadonlyArray<{ pagingToken: string }>
}

export default function Paging({
  usePaging = true,
  currentCursor,
  baseUrl,
  records,
  children,
}: React.PropsWithChildren<PagingProps>) {
  const navigate = useNavigate()

  if (!usePaging) return children

  const handleClickNext: MouseEventHandler<HTMLElement> = () => {
    const cursorNext = records[records.length - 1].pagingToken
    navigate(`${baseUrl}?cursor=${cursorNext}&order=desc`)
  }

  const handleClickPrev: MouseEventHandler<HTMLElement> = () => {
    const cursorPrev = records[0].pagingToken
    navigate(`${baseUrl}?cursor=${cursorPrev}&order=asc`)
  }

  return (
    <div id="pagingwrap">
      <PagingControls
        hidePrev={!currentCursor}
        handleClickNext={handleClickNext}
        handleClickPrev={handleClickPrev}
      />
      {children}
    </div>
  )
}
