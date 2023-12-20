import { createCookieSessionStorage } from '@remix-run/node'

type SessionData = {
  horizonAddress: string
  sorobanRPCAddress: string
}

type SessionFlashData = {
  error: string
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: '__session',
    },
  })

export { getSession, commitSession, destroySession }
