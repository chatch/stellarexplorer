import React from 'react'
import {
  Nav,
  Navbar,
  NavItem,
  MenuItem,
  NavDropdown,
  FormGroup
} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import {FormattedMessage} from 'react-intl'

import NetworkSelector from './NetworkSelector'
import SearchBox from './SearchBox'
import logo from '../../img/logo.png';

class Header extends React.Component {
  render() {
    return (
      <Navbar fluid fixedTop collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">
              <img src={logo} className="App-logo" alt="logo"/>
              <span className="brand-text">Explorer</span>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/ledgers">
              <NavItem eventKey={1}><FormattedMessage id="ledgers"/></NavItem>
            </LinkContainer>
            <LinkContainer to="/txs">
              <NavItem eventKey={2}><FormattedMessage id="transactions"/></NavItem>
            </LinkContainer>
            <NavDropdown eventKey={3} title="More" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1} href="/anchors">Anchors</MenuItem>
              <MenuItem eventKey={3.2} href="https://www.stellar.org/laboratory/">Laboratory</MenuItem>
              <MenuItem eventKey={3.3} href="https://stellarterm.com/">StellarTerm</MenuItem>
              <MenuItem eventKey={3.4} href="https://dashboard.stellar.org/">Stellar Dashboard</MenuItem>
              <MenuItem eventKey={3.5} href="http://stellar.network/">Stellar Network</MenuItem>
              <MenuItem eventKey={3.6} href="https://www.stellar.org/stats/">Stats</MenuItem>
            </NavDropdown>
          </Nav>
          <Navbar.Form pullRight>
            <NetworkSelector
              network={this.props.network}
              switcher={this.props.networkSwitcher}/>
          </Navbar.Form>
          <Navbar.Form pullRight>
            <FormGroup>
              <SearchBox/>
            </FormGroup>
          </Navbar.Form>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header
