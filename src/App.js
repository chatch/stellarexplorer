import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

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

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

addLocaleData([
  ...en,
  ...zh
])

const locale = localStorage.getItem("lang") || navigator.language || "en"

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
    lang: locale
  }

  languageSwitch = locale => {
    localStorage.setItem("lang", locale);
    this.setState({lang: locale})
  }

  render() {
    return (
      <IntlProvider
        key={this.state.lang}
        locale={this.state.lang}
        messages={getMessages(this.state.lang)}>
        <Router>
          <div className="App">
            <Header lang={this.state.lang} languageSwitch={this.languageSwitch}/>
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

export default App;
