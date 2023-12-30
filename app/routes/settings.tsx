import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { getSession, commitSession } from '~/sessions'

/**
 * Stores or clears session settings which include:
 * - custom soroban rpc address
 * - custom horizon rpc address
 *
 * It is called from:
 * - set custom network addresses form
 * - select core network button (which clears the settings for addresses)
 */
export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  const form = await request.formData()

  session.set('horizonAddress', (form.get('horizonAddress') as string) ?? '')
  session.set(
    'sorobanRPCAddress',
    (form.get('sorobanRPCAddress') as string) ?? '',
  )

  const url = new URL(request.url)
  let redirectAddress = '/'
  if ('true' === url.searchParams.get('unset')) {
    redirectAddress = (form.get('redirect_to') as string) ?? redirectAddress
  }

  return redirect(redirectAddress, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
