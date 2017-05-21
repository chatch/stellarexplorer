import React, {Component} from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/Home'

import Ledger from './components/Ledger'
import Ledgers from './components/Ledgers'
import Transaction from './components/Transaction'
import Transactions from './components/Transactions'
import Accounts from './components/Accounts'

// import logo from './logo.svg';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';


// TODO: setup i18n and translate to Chinese and Nigerian and Phillipino to start with ...
//       add language selection widget but autoset on first load using the accept-language headers
class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Header/>
                    <Route exact path="/" component={Home} />
                    <Route path="/ledgers" component={Ledgers} />
                    <Route path="/ledger/:id" component={Ledger} />
                    <Route path="/txs" component={Transactions} />
                    <Route path="/tx/:id" component={Transaction} />
                    <Route path="/accounts" component={Accounts} />
                    <Footer/>
                </div>
            </Router>
        );
    }
}

export default App;
