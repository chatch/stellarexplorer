import { redirect } from '@remix-run/node'
import { searchStrToPath } from '~/lib/search'

export const loader = async ({ params }: { params: { searchStr: string } }) => {
  const matchPath = searchStrToPath(params.searchStr)
  return redirect(matchPath as string)
}
