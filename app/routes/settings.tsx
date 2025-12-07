import type { ActionFunctionArgs } from '~/lib/remix-shim'
import { useEffect } from 'react'
import { redirect } from '~/lib/remix-shim'

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
export async function clientAction({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  const form = await request.formData()

  session.set('horizonAddress', (form.get('horizonAddress') as string) ?? '')
  session.set(
    'sorobanRPCAddress',
    (form.get('sorobanRPCAddress') as string) ?? '',
  )

  console.log('clientAction called', { url: request.url, form: Object.fromEntries(form) })

  const url = new URL(request.url)
  let redirectAddress = '/'
  const isUnset = url.searchParams.get('unset') === 'true' || form.get('unset') === 'true'

  const rawRedirectTo = form.get('redirect_to') as string
  if (isUnset) {
    // Use || to ensure empty string falls back to default
    redirectAddress = rawRedirectTo || '/'
  }

  console.log('Settings Action Debug:', {
    isUnset,
    rawRedirectTo,
    redirectAddress,
    entries: Object.fromEntries(form)
  })

  return redirect(redirectAddress, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export default function Settings() {
  return null
}
