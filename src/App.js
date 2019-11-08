import React, {Component} from 'react'
import ReactLoadable from 'react-loadable'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import PropTypes from 'prop-types'

import {IntlProvider, addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import vi from 'react-intl/locale-data/vi'
import ru from 'react-intl/locale-data/ru'
import zh from 'react-intl/locale-data/zh'
import enMessages from './languages/en'
import ruMessages from './languages/ru'
import viMessages from './languages/vi'
import zhMessages from './languages/zh'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/Home'
import SearchBox from './components/layout/SearchBox'
import NoMatchError from './components/shared/NoMatchError'
import InsecureNetworkError from './components/shared/InsecureNetworkError'
import Error from './components/shared/Error'
import {Spinner} from './components/shared/Spinner'
import InfoBanner from './components/shared/InfoBanner'

import {networks, Server} from './lib/stellar'
import {hostnameToNetworkType} from './lib/stellar/networks'
import {defaultNetworkAddresses} from './lib/stellar/server'
import {storageInit} from './lib/utils'
import {searchStrToPath} from './lib/search'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-json-pretty/src/JSONPretty.1337.css'
import './App.css'

const HOME_PUBLIC = 'https://steexp.com'
const HOME_TESTNET = 'https://testnet.steexp.com'

const storage = storageInit()

addLocaleData([...en, ...ru, ...vi, ...zh])

const initialLanguage =
  storage.getItem('language') || navigator.language || 'en'

// Derive network type from the hostname.
// Network settings determine which horizon instance to pull data from.
const networkType = hostnameToNetworkType(window.location.hostname)
const networkAddress =
  storage.getItem('networkAddress') || defaultNetworkAddresses[networkType]

const getMessages = locale => {
  switch (locale) {
    case 'vi':
      return viMessages
    case 'ru':
      return ruMessages
    case 'zh':
      return zhMessages
    default:
      return enMessages
  }
}

/*
 * Dyanmically loaded components
 */

const Loadable = componentStr =>
  ReactLoadable({
    loader: () => import(`./components/${componentStr}`),
    loading() {
      return <Spinner />
    },
  })

const Account = Loadable('Account')
const Accounts = Loadable('Accounts')
const Anchor = Loadable('Anchor')
const Anchors = Loadable('Anchors')
const Assets = Loadable('Assets')
const Effects = Loadable('Effects')
const Exchanges = Loadable('Exchanges')
const Ledger = Loadable('Ledger')
const Ledgers = Loadable('Ledgers')
const Operations = Loadable('Operations')
const Payments = Loadable('Payments')
const Trades = Loadable('Trades')
const Transaction = Loadable('Transaction')
const Transactions = Loadable('Transactions')

class App extends Component {
  state = {
    language: initialLanguage,
    networkType: networkType,
    networkAddress: networkAddress,
    server: Server(networkType, networkAddress, storage),
  }

  componentWillMount() {
    if (this.state.networkAddress !== networkAddress) {
      this.setNetworkAddress(networkAddress, window.location.href)
    }
  }

  setNetworkAddress = (networkAddress, href) => {
    console.log(
      `NETWORK change: ${this.state.networkAddress} to ${networkAddress}`
    )
    storage.setItem('networkAddress', networkAddress)

    if (!href) href = window.location.origin
    window.location.href = href
  }

  // network switcher buttons in the header - public or testnet switch
  switchNetworkType = networkType => {
    window.location.href =
      networkType === networks.public ? HOME_PUBLIC : HOME_TESTNET
  }

  languageSwitcher = event => {
    const newLanguage = event.target.lang
    storage.setItem('language', newLanguage)
    this.setState({language: newLanguage})
  }

  // @see HOCs.js withServer() to get this as props in any component
  getChildContext() {
    return {server: this.state.server}
  }

  render() {
    return (
      <IntlProvider
        key={this.state.language}
        locale={this.state.language}
        messages={getMessages(this.state.language)}
      >
        <Router basename="">
          <div className="App">
            <Header
              networkAddress={this.state.networkAddress}
              networkType={this.state.networkType}
              setNetworkAddress={this.setNetworkAddress}
              switchNetworkType={this.switchNetworkType}
              language={this.state.language}
              languageSwitcher={this.languageSwitcher}
            />
            <SearchBox />
            <InfoBanner />
            <div id="main-content">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/accounts" component={Accounts} />
                <Route path="/account/:id" component={Account} />
                <Route path="/assets" component={Assets} />
                <Route path="/asset/:id" component={Assets} />
                <Route path="/anchors" component={Anchors} />
                <Route path="/anchor/:id" component={Anchor} />
                <Route path="/effects" component={Effects} />
                <Route path="/exchanges" component={Exchanges} />
                <Route path="/ledgers" component={Ledgers} />
                <Route path="/ledger/:id" component={Ledger} />
                <Route path="/operations" component={Operations} />
                <Route path="/payments" component={Payments} />
                <Route path="/trades" component={Trades} />
                <Route path="/txs" component={Transactions} />
                <Route path="/tx/:id" component={Transaction} />
                <Route
                  path="/search/:id"
                  render={({match}) => {
                    const searchStr = match.params.id
                    return <Redirect to={searchStrToPath(searchStr)} />
                  }}
                />
                <Route
                  path="/error/insecure-horizon-server"
                  component={InsecureNetworkError}
                />
                <Route path="/error/not-found/:id" component={NoMatchError} />
                <Route path="/error/general/:id" component={Error} />
                <Route component={Error} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </IntlProvider>
    )
  }
}

App.childContextTypes = {
  server: PropTypes.object,
}

export default App
