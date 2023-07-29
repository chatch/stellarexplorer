import type { PropsWithChildren } from 'react'
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.css'
import { useState } from 'react'
import { IntlProvider } from 'react-intl'
import { ClientOnly } from 'remix-utils'
import stylesheetUrl from '~/styles/styles.css'

import { cssBundleHref } from '@remix-run/css-bundle'
import {
  Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useRouteError
} from '@remix-run/react'

import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import { Spinner } from './components/shared/Spinner'
import { HorizonServerHandleContext, SorobanServerHandleContext } from './contexts'
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
import { SorobanServer } from './lib/stellar'
import networks from './lib/stellar/networks'
import HorizonServer, { defaultNetworkAddresses } from './lib/stellar/server'
import { storageInit } from './lib/utils'
import SearchBox from './SearchBox'

import type { LinksFunction } from "@remix-run/node"
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: bootstrapStyles },
  { rel: "stylesheet", href: stylesheetUrl },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
]

const HOME_PUBLIC = 'https://steexp.com'
const HOME_TESTNET = 'https://testnet.steexp.com'
const HOME_FUTURENET = 'https://futurenet.steexp.com'

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

const redirectToNetworkAddressFn = (storage: Storage) => (networkAddress: string, href: string) => {
  console.log(
    `NETWORK change: to ${networkAddress}`
  )
  storage.setItem('networkAddress', networkAddress)
  if (!href) href = window.location.origin
  window.location.href = href
}

// network switcher buttons in the header
const redirectToNetworkType = (networkType: string) => {
  let href = HOME_PUBLIC
  if (window.location.hostname.endsWith('.local')) {
    href = `http://${networkType}net.local:3000`
  } else if (networkType === networks.test) {
    href = HOME_TESTNET
  } else if (networkType === networks.future) {
    href = HOME_FUTURENET
  }
  window.location.href = href
}

const languageSwitcherFn = (setLanguage: Function) => (event: any) => {
  const newLanguage = event.target.lang
  storage.setItem('language', newLanguage)
  setLanguage(newLanguage)
}

const createHorizonServerHandle = (networkType: string, networkAddress: string, storage: Storage): HorizonServer | null => {
  try {
    return new HorizonServer(networkType, networkAddress)
  } catch (err) {
    storage.removeItem('networkAddress')
    window.location.href = `/error/insecure-horizon-server/?${networkAddress}`
    return null
  };
}

function HtmlDocument({
  children,
  title
}: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="en">
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
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {/* TODO: restore cloudflare analytics here before deployment */}
      </body>
    </html>
  )
}

export default function App() {
  const [language, setLanguage] = useState('en')
  const [networkType, setNetworkType] = useState(networks.future)
  const [networkAddress, setNetworkAddress] = useState(defaultNetworkAddresses.future)

  // TODO: restore initilize / first time logic here:

  // const serverRef = useRef<HorizonServer | null>(null);
  // const sorobanServerRef = useRef<SorobanServer | null>(null);

  // useEffect(() => {
  //   const initialLanguage = storage.getItem('language') ||
  //     navigator.language ||
  //     'en'
  //   setLanguage(initialLanguage)

  //   const initialNetworkType = hostnameToNetworkType(window.location.hostname)
  //   setNetworkType(initialNetworkType)

  //   const initialNetworkAddress = storage.getItem('networkAddress') || defaultNetworkAddresses[initialNetworkType]
  //   setNetworkAddress(initialNetworkAddress)

  //   console.log(`root.userEffect1 complete with ${initialLanguage} ${initialNetworkType} ${initialNetworkAddress}`)
  //   console.log(`root.userEffect2 complete with ${language} ${networkType} ${networkAddress}`)

  //   serverRef.current =
  //     createHorizonServerHandle(initialNetworkType, initialNetworkAddress, storage)
  //   sorobanServerRef.current = initialNetworkType === 'futurenet' ?
  //     new SorobanServer(initialNetworkType) : null
  // },
  //   []
  // )

  // console.log(`root.userEffect3 complete with ${language} ${networkType} ${networkAddress}`)

  const server = createHorizonServerHandle(networkType, networkAddress, storage)
  const sorobanServer = new SorobanServer(networkType)


  // In order to set a memoized server handle we need both useEffect and 
  // useMemo. The way to achieve that is to use a ref, use the effect and
  // finally use the memorize:
  // const server: HorizonServer | null = useMemo(() => serverRef.current, []);
  // const sorobanServer: SorobanServer | null =
  //   useMemo(
  //     () => sorobanServerRef.current,
  //     []
  //   );

  return (
    <HtmlDocument>
      <div className="App">
        <ClientOnly fallback={<Spinner />}>
          {() =>
            <IntlProvider
              key={language}
              locale={language}
              messages={getMessages(language)}
            >
              <Header
                networkAddress={networkAddress}
                networkType={networkType}
                setNetworkAddress={redirectToNetworkAddressFn(storage)}
                switchNetworkType={redirectToNetworkType}
                languageSwitcher={languageSwitcherFn(setLanguage)}
              />
              <SearchBox />
              <div id="main-content">
                <HorizonServerHandleContext.Provider value={server}>
                  <SorobanServerHandleContext.Provider value={sorobanServer}>
                    <Outlet />
                  </SorobanServerHandleContext.Provider>
                </HorizonServerHandleContext.Provider>
              </div>
            </IntlProvider>
          }
        </ClientOnly>
        <Footer />
      </div>
    </HtmlDocument>
  )
}

export function ErrorBoundary() {
  const error: any = useRouteError()

  let errorMessage
  if (error.data) {
    errorMessage = error.data
  } else if (error.message) {
    errorMessage = error.message
  } else {
    errorMessage = "Unknown error"
  }

  return (
    <HtmlDocument title="Stellar Explorer - Error">
      <div className="error-container">
        <h1>Error</h1>
        <pre>{errorMessage}</pre>
      </div>
    </HtmlDocument>
  )
}