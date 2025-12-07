import Cookies from 'js-cookie'

type _SessionData = {
  horizonAddress?: string
  sorobanRPCAddress?: string
  language?: string
}

type _SessionFlashData = {
  error: string
}

const _SESSION_COOKIE_NAME = '__session'

const getSession = async (_cookieHeader?: string | null) => {
  // In client-side mode, we ignore the cookieHeader and read directly from browser cookies
  // or handle initial SSR state if we were doing SSR, but for pure SPA we just read from document
  return {
    get: (key: string) => {
      const cookieValue = Cookies.get(key)
      return cookieValue
    },
    set: (key: string, value: string) => {
      Cookies.set(key, value, { expires: 365 })
    },
    unset: (key: string) => {
      Cookies.remove(key)
    },
    has: (key: string) => {
      return !!Cookies.get(key)
    },
  }
}

const commitSession = async (_session: unknown) => {
  // In this client-side implementation, setting values in 'getSession' already writes to cookies.
  // So this might be a no-op or just return the cookie string if needed.
  // For compatibility with Remix loaders that might return a Set-Cookie header (which we are mocking),
  // we can return the cookie string.
  return ''
}

const destroySession = async (_session: unknown) => {
  // This would typically return a header to delete the cookie.
  // In client-side, we should have already called unset.
  return ''
}

export { getSession, commitSession, destroySession }
