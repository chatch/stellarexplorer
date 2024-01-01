import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'
import { cssBundleHref } from '@remix-run/css-bundle'
import { json } from '@remix-run/node'
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useRouteError,
} from '@remix-run/react'
import { captureRemixErrorBoundaryError, withSentry } from '@sentry/remix'

import bootstrapStyles from 'bootstrap/dist/css/bootstrap.css'
import jsonPrettyStyles from 'react-json-pretty/themes/1337.css'
import siteStyles from '~/styles/styles.css'
import lightSiteStyles from '~/styles/styles.light.css'

import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import enMessages from './lib/languages/en.json'
import frMessages from './lib/languages/fr.json'
import hiMessages from './lib/languages/hi.json'
import idMessages from './lib/languages/id.json'
import jaMessages from './lib/languages/ja.json'
import ruMessages from './lib/languages/ru.json'
import urMessages from './lib/languages/ur.json'
import viMessages from './lib/languages/vi.json'
import zhHansMessages from './lib/languages/zh-Hans.json'
import zhHantMessages from './lib/languages/zh-Hant.json'

import { requestToNetworkDetails } from './lib/stellar/networks'
import { storageInit } from './lib/utils'
import SearchBox from './SearchBox'
import { NotFoundError } from 'stellar-sdk'
import { ThemeProvider, useTheme } from '~/context/theme.provider'
import type { ErrorBoundaryComponent } from '@remix-run/react/dist/routeModules'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: bootstrapStyles },
  { rel: 'stylesheet', href: jsonPrettyStyles },
  { rel: 'stylesheet', href: siteStyles },
  { rel: 'stylesheet', href: lightSiteStyles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

const storage = storageInit()

const getMessages = (locale: string) => {
  switch (locale) {
    case 'fr':
      return frMessages
    case 'hi':
      return hiMessages
    case 'id':
      return idMessages
    case 'ja':
      return jaMessages
    case 'ru':
      return ruMessages
    case 'ur':
      return urMessages
    case 'vi':
      return viMessages
    case 'zh-Hans':
      return zhHansMessages
    case 'zh-Hant':
      return zhHantMessages
    default:
      return enMessages
  }
}

const languageSwitcherFn = (setLanguage: Function) => (event: any) => {
  const newLanguage = event.target.lang as string
  ;(storage as Storage).setItem('language', newLanguage)
  setLanguage(newLanguage)
}

function HtmlDocument({
  children,
  title,
}: PropsWithChildren<{ title?: string }>) {
  const [theme] = useTheme()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <html lang="en" data-bs-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="search"
          href="/search.xml"
          title="Stellar Explorer"
          type="application/opensearchdescription+xml"
        />
        <Meta />
        {title ? <title>{title}</title> : null}
        <Links />
      </head>
      <body>
        {!isLoading && children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "fb352560547d4b2192cb3dbf4d174a08"}'
        ></script>
      </body>
    </html>
  )
}

export const loader = ({ request }: LoaderFunctionArgs) =>
  requestToNetworkDetails(request).then((networkDetails) =>
    json({ ...networkDetails }),
  )

function App() {
  const navigation = useNavigation()
  const [language, setLanguage] = useState('en')
  const {
    networkType,
    isLocal,
    isCustom,
    customHorizonAddress: horizonAddress,
    customSorobanRPCAddress: sorobanRPCAddress,
  } = useLoaderData<typeof loader>()

  return (
    <ThemeProvider>
      <HtmlDocument>
        <div className="App">
          <IntlProvider
            key={language}
            locale={language}
            messages={getMessages(language)}
          >
            <Header
              languageSwitcher={languageSwitcherFn(setLanguage)}
              networkType={networkType}
              isLocal={isLocal}
              isCustom={isCustom}
              customHorizonAddress={horizonAddress}
              customSorobanRPCAddress={sorobanRPCAddress}
            />
            <SearchBox />
            <div
              id="main-content"
              className={navigation.state === 'loading' ? 'loading' : ''}
            >
              <Outlet />
            </div>
          </IntlProvider>
          <Footer />
        </div>
      </HtmlDocument>
    </ThemeProvider>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = () => {
  const error: any = useRouteError()

  // don't send steller resource not founds to sentry
  // see comments in entry.server.tsx as well ...
  if (!(error instanceof NotFoundError)) {
    captureRemixErrorBoundaryError(error)
  }

  let errorMessage
  if (error.data) {
    errorMessage = error.data
  } else if (error.message) {
    errorMessage = error.message
  } else {
    errorMessage = 'Unknown error'
  }

  return (
    <ThemeProvider>
      <HtmlDocument title="Stellar Explorer - Error">
        <div className="error-container">
          <h1>Error</h1>
          <pre>{errorMessage}</pre>
        </div>
      </HtmlDocument>
    </ThemeProvider>
  )
}

export default withSentry(App)
