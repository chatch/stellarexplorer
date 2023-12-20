// The following import fails. There is a related discussion without resolution:
// https://github.com/remix-run/remix/discussions/7666

// import { createCookieSessionStorage } from '@remix-run/node'

// So working around this with manual setup:

const serverRuntime = require('@remix-run/server-runtime')
const crypto = require('@remix-run/node/dist/crypto')

const createCookie = serverRuntime.createCookieFactory({
  sign: crypto.sign,
  unsign: crypto.unsign,
})
const createCookieSessionStorage =
  serverRuntime.createCookieSessionStorageFactory(createCookie)

// Leave the types in here so we can use them again once the above import
// issue is resolved:

// type SessionData = {
//   horizonAddress: string
//   sorobanRPCAddress: string
// }

// type SessionFlashData = {
//   error: string
// }

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage(
    //   <SessionData, SessionFlashData>
    {
      cookie: {
        name: '__session',
        // cookie is only storing user preferences and so we put a secret here
        // in plain sight really just to supress the signed cookies warning.
        // if anything private moves here in the future move the secret to an
        // env var and put it in 'fly secrets' or similar.
        secrets: ['in_plain_sight'],
      },
    },
  )

export { getSession, commitSession, destroySession }
