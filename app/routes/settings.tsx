import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { getSession, commitSession } from '~/sessions'

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  const form = await request.formData()
  const horizonAddress: string = (form.get('horizonAddress') as string) ?? ''
  const sorobanRPCAddress: string =
    (form.get('sorobanRPCAddress') as string) ?? ''

  session.set('horizonAddress', horizonAddress)
  session.set('sorobanRPCAddress', sorobanRPCAddress)

  // Login succeeded, send them to the home page.
  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
