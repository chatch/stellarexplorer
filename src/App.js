import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'

import {IntlProvider, addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'
import enMessages from './languages/en'
import zhMessages from './languages/zh'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/Home'
import NoMatch from './components/shared/NoMatch'

import Ledger from './components/Ledger'
import Ledgers from './components/Ledgers'
import Transaction from './components/Transaction'
import Transactions from './components/Transactions'
import Account from './components/Account'
import Accounts from './components/Accounts'
import Anchors from './components/Anchors'
import Operations from './components/Operations'

import {networks, NETWORK_PUBLIC, NETWORK_TEST} from './lib/stellar'
import {storageInit} from './lib/utils'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const HOME_TESTNET = 'https://testnet.steexp.com'
const HOME_PUBLIC = 'https://steexp.com'

const storage = storageInit()

addLocaleData([...en, ...zh])

const initialLanguage =
  storage.getItem('language') || navigator.language || 'en'
const initialNetwork = storage.getItem('network') || NETWORK_PUBLIC

const getMessages = locale => {
  switch (locale) {
    case 'zh':
      return zhMessages
    default:
      return enMessages
  }
}

const reloadPage = () => window.location.reload(true)
const isTestnetAddr = () => /^testnet\..*/.test(window.location.hostname)

class App extends Component {
  state = {
    language: initialLanguage,
    network: initialNetwork,
    server: networks[initialNetwork].initFunc(),
  }

  componentWillMount() {
    // handle direct to testnet links in the form testnet.steexp.com/*
    // and handle switch back to public when testnet is not in the domain
    if (isTestnetAddr()) {
      if (this.state.network !== NETWORK_TEST) {
        this.setNetwork(NETWORK_TEST)
      }
    } else {
      if (this.state.network !== NETWORK_PUBLIC) {
        this.setNetwork(NETWORK_PUBLIC)
      }
    }
  }

  setNetwork = (network, page) => {
    console.log(`NETWORK change: ${this.state.network} to ${network}`)
    storage.setItem('network', network)
    this.setState(
      {
        network: network,
        server: networks[network].initFunc(),
      },
      page ? () => (window.location.href = page) : reloadPage
    )
  }

  networkSwitcher = selectedNetwork => {
    const newHome =
      selectedNetwork === NETWORK_PUBLIC ? HOME_PUBLIC : HOME_TESTNET
    this.setNetwork(selectedNetwork, newHome)
  }

  languageSwitcher = event => {
    const newLanguage = event.target.lang
    storage.setItem('language', newLanguage)
    this.setState({language: newLanguage}, reloadPage)
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
            <div id="main-content">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/ledgers" component={Ledgers} />
                <Route path="/ledger/:id" component={Ledger} />
                <Route path="/txs" component={Transactions} />
                <Route path="/tx/:id" component={Transaction} />
                <Route path="/operations" component={Operations} />
                <Route path="/accounts" component={Accounts} />
                <Route path="/account/:id" component={Account} />
                <Route path="/anchors" component={Anchors} />
                <Route path="/error/not-found/:id" component={NoMatch} />
                <Route component={NoMatch} />
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
