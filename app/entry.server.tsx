import { PassThrough } from "stream"

import { Response } from "@remix-run/node" // or cloudflare/deno
import type {
  AppLoadContext,
  EntryContext,
  Headers,
} from "@remix-run/node" // or cloudflare/deno
import { RemixServer } from "@remix-run/react"
import isbot from "isbot"
import { renderToPipeableStream } from "react-dom/server"
import * as Sentry from "@sentry/remix"

const ABORT_DELAY = 5000

Sentry.init({
  dsn: "https://cbde552cd9c3a2300daf1355b7e14e7e@o4505837033095168.ingest.sentry.io/4505837045153792",

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
  loadContext: AppLoadContext
) {
  // If the request is from a bot, we want to wait for the full
  // response to render before sending it to the client. This
  // ensures that bots can see the full page content.
  if (isbot(request.headers.get("user-agent"))) {
    return serveTheBots(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext
    )
  }

  return serveBrowsers(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  )
}

function serveTheBots(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
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
          responseHeaders.set("Content-Type", "text/html")
          const body = new PassThrough()
          pipe(body)
          resolve(
            new Response(body, {
              status: responseStatusCode,
              headers: responseHeaders,
            })
          )
        },
        onShellError(err: unknown) {
          reject(err)
        },
      }
    )
    setTimeout(abort, ABORT_DELAY)
  })
}

function serveBrowsers(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
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
          responseHeaders.set("Content-Type", "text/html")
          const body = new PassThrough()
          pipe(body)
          resolve(
            new Response(body, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            })
          )
        },
        onShellError(err: unknown) {
          reject(err)
        },
        onError(err: unknown) {
          didError = true
          console.error(err)
        },
      }
    )
    setTimeout(abort, ABORT_DELAY)
  })
}
