import React, {Component} from 'react'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'

import Home from './components/Home'
import Ledger from './components/Ledger'
import Ledgers from './components/Ledgers'
import Transaction from './components/Transaction'
import Transactions from './components/Transactions'
import SearchBox from './components/SearchBox'

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
                    <div>
                        <Navbar>
                            <Navbar.Header>
                                <Navbar.Brand>
                                    <Link to="/">Stellar Graph</Link>
                                </Navbar.Brand>
                            </Navbar.Header>
                            <Nav>
                                <LinkContainer to="/ledgers"><NavItem eventKey={1}>Ledgers</NavItem></LinkContainer>
                                <LinkContainer to="/txs"><NavItem eventKey={2}>Transactions</NavItem></LinkContainer>
                                <NavDropdown eventKey={3} title="More" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1}>Accounts</MenuItem>
                                    <MenuItem eventKey={3.2}>Stats</MenuItem>
                                    <MenuItem eventKey={3.3} href="https://www.stellar.org/laboratory/">Laboratory</MenuItem>
                                    <MenuItem eventKey={3.4} href="https://stellarterm.com/">StellarTerm</MenuItem>
                                </NavDropdown>
                            </Nav>
                            <Nav pullRight>
                                <SearchBox/>
                            </Nav>
                        </Navbar>
                    </div>

                    <Route exact path="/" component={Home} />
                    <Route path="/ledgers" component={Ledgers} />
                    <Route path="/ledger/:id" component={Ledger} />
                    <Route path="/txs" component={Transactions} />
                    <Route path="/tx/:id" component={Transaction} />
                </div>
            </Router>
        );
    }
}

export default App;
