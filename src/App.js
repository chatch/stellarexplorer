import React, {Component} from 'react'
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
import Error from './components/shared/Error'
import SponsoredLink from './components/shared/SponsoredLink'

import Ledger from './components/Ledger'
import Ledgers from './components/Ledgers'
import Transaction from './components/Transaction'
import Transactions from './components/Transactions'
import Account from './components/Account'
import Accounts from './components/Accounts'
import Anchor from './components/Anchor'
import Anchors from './components/Anchors'
import Exchanges from './components/Exchanges'
import Operations from './components/Operations'
import Payments from './components/Payments'
import Trades from './components/Trades'
import Assets from './components/Assets'
import Effects from './components/Effects'
import InflationPools from './components/InflationPools'

import {networks, Server} from './lib/stellar'
import {hostnameToNetwork} from './lib/stellar/networks'
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
const initialNetwork = storage.getItem('network') || networks.public

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

class App extends Component {
  state = {
    language: initialLanguage,
    network: initialNetwork,
    server: Server(initialNetwork),
  }

  componentWillMount() {
    // Derive network from the hostname.
    // Network setting determines which horizon instance to pull data from.
    const network = hostnameToNetwork(window.location.hostname)
    if (this.state.network !== network)
      this.setNetwork(network, window.location.href)
  }

  setNetwork = (network, href) => {
    console.log(`NETWORK change: ${this.state.network} to ${network}`)
    storage.setItem('network', network)
    window.location.href = href
  }

  // network switcher buttons in the header - public or testnet switch
  networkSwitcher = selectedNetwork => {
    const newHome =
      selectedNetwork === networks.public ? HOME_PUBLIC : HOME_TESTNET
    this.setNetwork(selectedNetwork, newHome)
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
              network={this.state.network}
              networkSwitcher={this.networkSwitcher}
              language={this.state.language}
              languageSwitcher={this.languageSwitcher}
            />
            <div id="Search-Container">
              <SearchBox />
            </div>
            <div id="main-content">
              <SponsoredLink />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/accounts" component={Accounts} />
                <Route path="/account/:id" component={Account} />
                <Route path="/assets" component={Assets} />
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
                <Route path="/pools" component={InflationPools} />
                <Route
                  path="/search/:id"
                  render={({match}) => {
                    const searchStr = match.params.id
                    return <Redirect to={searchStrToPath(searchStr)} />
                  }}
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
