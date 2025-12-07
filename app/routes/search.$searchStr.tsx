import { redirect } from '~/lib/remix-shim'
import { searchStrToPath } from '~/lib/search'

export const clientLoader = async ({ params }: { params: { searchStr: string } }) => {
  const matchPath = searchStrToPath(params.searchStr)
  return redirect(matchPath as string)
}
