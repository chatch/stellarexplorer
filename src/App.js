import React, { Component } from 'react'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'

import AppFront from './components/AppFront'
import SearchBox from './components/SearchBox'

// import logo from './logo.svg';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// TODO: setup i18n and translate to Chinese and Nigerian and Phillipino to start with ...
//       add language selection widget but autoset on first load using the accept-language headers
class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
            <Navbar>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="#">Stellar Graph</a>
                </Navbar.Brand>
              </Navbar.Header>
              <Nav>
                <NavItem eventKey={1} href="#">Accounts</NavItem>
                <NavItem eventKey={2} href="#">Ledgers</NavItem>
                <NavDropdown eventKey={3} title="More" id="basic-nav-dropdown">
                  <MenuItem eventKey={3.1}>Stuff 1</MenuItem>
                  <MenuItem eventKey={3.2}>Stuff 2</MenuItem>
                </NavDropdown>
              </Nav>
              <Nav pullRight>
                <SearchBox/>
              </Nav>
            </Navbar>
        </div>

        <AppFront/>

      </div>
    );
  }
}

export default App;
