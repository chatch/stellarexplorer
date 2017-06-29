import React from 'react'
import {
  Nav,
  Navbar,
  NavItem,
  MenuItem,
  NavDropdown,
  FormGroup,
} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import {FormattedMessage} from 'react-intl'

import LanguageSelector from './LanguageSelector'
import NetworkSelector from './NetworkSelector'
import SearchBox from './SearchBox'
import logoImg from '../../img/logo.png'

class Header extends React.Component {
  render() {
    return (
      <Navbar fluid fixedTop collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">
              <img src={logoImg} className="App-logo" alt="logo" />
              <span className="brand-text">Explorer</span>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/">
              <NavItem>
                <FormattedMessage id="home" />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/operations">
              <NavItem>
                <FormattedMessage id="operations" />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/txs">
              <NavItem>
                <FormattedMessage id="transactions" />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/ledgers">
              <NavItem><FormattedMessage id="ledgers" /></NavItem>
            </LinkContainer>
            <NavDropdown title="More" id="basic-nav-dropdown">
              <MenuItem href="/anchors">Anchors</MenuItem>
              <MenuItem href="https://www.stellar.org/laboratory/">
                Laboratory
              </MenuItem>
              <MenuItem href="https://stellarterm.com/">
                StellarTerm
              </MenuItem>
              <MenuItem href="https://dashboard.stellar.org/">
                Stellar Dashboard
              </MenuItem>
              <MenuItem href="http://stellar.network/">
                Stellar Network
              </MenuItem>
            </NavDropdown>
          </Nav>
          <Navbar.Form pullRight>
            <LanguageSelector
              language={this.props.language}
              switcher={this.props.languageSwitcher}
            />
          </Navbar.Form>
          <Navbar.Form pullRight>
            <NetworkSelector
              network={this.props.network}
              switcher={this.props.networkSwitcher}
            />
          </Navbar.Form>
          <Navbar.Form pullRight>
            <FormGroup>
              <SearchBox />
            </FormGroup>
          </Navbar.Form>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header
