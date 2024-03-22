import { PassThrough } from 'stream'
import { createReadableStreamFromReadable } from '@remix-run/node'
import type { AppLoadContext, EntryContext } from '@remix-run/node' // or cloudflare/deno
import { RemixServer } from '@remix-run/react'
import isbot from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import * as Sentry from '@sentry/remix'
import { NotFoundError } from 'stellar-sdk'

const ABORT_DELAY = 5000

Sentry.init({
  dsn: 'https://cbde552cd9c3a2300daf1355b7e14e7e@o4505837033095168.ingest.sentry.io/4505837045153792',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {
  // If the request is from a bot, we want to wait for the full
  // response to render before sending it to the client. This
  // ensures that bots can see the full page content.
  if (isbot(request.headers.get('user-agent'))) {
    return serveTheBots(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext,
    )
  }

  return serveBrowsers(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
  )
}

export function handleError(
  error: unknown,
  { request }: { request: Request },
): void {
  console.error(`entry.server: handleError: error: ${JSON.stringify(error)}`)
  if ((error as any).stack) {
    console.error(`entry.server: handleError: stack: ${(error as any).stack}`)
  }

  if (error instanceof NotFoundError) {
    // don't send stellar resource not founds to sentry
    // they are handled and error shown to user
    // just log to console here for dev visibility
    //
    // additionally this hides the following redirect that i can't yet figure
    // out why it's happening:
    //    GET /account/GCDP3JW7RSYNKCJ57W7ZNQX3BDR74GQEX2VHBIZQATN2BR6YYFLI4EDC?_data=routes%2Faccount.%24accountId._index 500
    //
    // it comes after a :
    //    GET /account/GCDP3JW7RSYNKCJ57W7ZNQX3BDR74GQEX2VHBIZQATN2BR6YYFLI4EDC?_data=routes%2Faccount.%24accountId 404
    //
    // which is the correct response and renders correctly but for some reason
    // remix is invoking this follow up that fails ...
    console.warn(`404 for ${request.url}`)
  } else if (error instanceof Error) {
    Sentry.captureRemixServerException(error, 'remix.server', request)
  } else {
    // Optionally capture non-Error objects
    Sentry.captureException(error)
  }
}

function serveTheBots(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        // Use onAllReady to wait for the entire document to be ready
        onAllReady() {
          responseHeaders.set('Content-Type', 'text/html')
          const body = new PassThrough()
          pipe(body)
          resolve(
            new Response(createReadableStreamFromReadable(body), {
              status: responseStatusCode,
              headers: responseHeaders,
            }),
          )
        },
        onShellError(err: unknown) {
          reject(err)
        },
      },
    )
    setTimeout(abort, ABORT_DELAY)
  })
}

function serveBrowsers(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let didError = false
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        // use onShellReady to wait until a suspense boundary is triggered
        onShellReady() {
          responseHeaders.set('Content-Type', 'text/html')
          const body = new PassThrough()
          pipe(body)
          resolve(
            new Response(createReadableStreamFromReadable(body), {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            }),
          )
        },
        onShellError(err: unknown) {
          reject(err)
        },
        onError(err: unknown) {
          didError = true
          console.error(err)
        },
      },
    )
    setTimeout(abort, ABORT_DELAY)
  })
}
