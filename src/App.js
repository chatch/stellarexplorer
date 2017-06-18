import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import PropTypes from 'prop-types'

import {IntlProvider, addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'
import enMessages from "./languages/en";
import zhMessages from "./languages/zh";

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/Home'

import Ledger from './components/Ledger'
import Ledgers from './components/Ledgers'
import Transaction from './components/Transaction'
import Transactions from './components/Transactions'
import Account from './components/Account'
import Accounts from './components/Accounts'
import Anchors from './components/Anchors'

import {networks} from './lib/Stellar'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

addLocaleData([
  ...en,
  ...zh
])

const locale = localStorage.getItem("lang") || navigator.language || "en"
const network = localStorage.getItem("network") || "public"

const getMessages = locale => {
  switch (locale) {
    case "zh":
      return zhMessages
    default:
      return enMessages
  }
}

class App extends Component {
  state = {
    lang: locale,
    network: network,
    server: networks[network].initFunc()
  }

  languageSwitcher = locale => {
    localStorage.setItem("lang", locale)
    this.setState({lang: locale})
  }

  networkSwitcher = selectedNetwork => {
    console.log(`NETWORK change: ${this.state.network} to ${selectedNetwork}`)
    localStorage.setItem("network", selectedNetwork)
    const server = networks[selectedNetwork].initFunc()
    this.setState({network: selectedNetwork, server: server})
  }

  getChildContext() {
    return {server: this.state.server}
  }

  render() {
    return (
      <IntlProvider
        key={this.state.lang}
        locale={this.state.lang}
        messages={getMessages(this.state.lang)}>
        <Router>
          <div className="App">
            <Header network={this.state.network} networkSwitcher={this.networkSwitcher}/>
            <div id="main-content">
              <Route exact path="/" component={Home}/>
              <Route path="/ledgers" component={Ledgers}/>
              <Route path="/ledger/:id" component={Ledger}/>
              <Route path="/txs" component={Transactions}/>
              <Route path="/tx/:id" component={Transaction}/>
              <Route path="/accounts" component={Accounts}/>
              <Route path="/account/:id" component={Account}/>
              <Route path="/anchors" component={Anchors}/>
            </div>
            <Footer/>
          </div>
        </Router>
      </IntlProvider>
    );
  }
}

App.childContextTypes = {
  server: PropTypes.object
}

export default App
