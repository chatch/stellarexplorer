import React from 'react'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { isPubNet } from '../../lib/Stellar'
import SearchBox from './SearchBox'

class Header extends React.Component {
  render() {
    const netStr = (isPubNet) ? 'public' : 'testnet'
    return (
        <div>
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">
                            <ruby style={{rubyPosition:'under'}}>
                                Stellar Graph<rt>{netStr}</rt>
                            </ruby>
                        </Link>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    <LinkContainer to="/ledgers"><NavItem eventKey={1}>Ledgers</NavItem></LinkContainer>
                    <LinkContainer to="/txs"><NavItem eventKey={2}>Transactions</NavItem></LinkContainer>
                    <LinkContainer to="/accounts"><NavItem eventKey={3}>Accounts</NavItem></LinkContainer>
                    <NavDropdown eventKey={3} title="More" id="basic-nav-dropdown">
                        <MenuItem eventKey={3.1} href="https://www.stellar.org/laboratory/">Laboratory</MenuItem>
                        <MenuItem eventKey={3.2} href="https://stellarterm.com/">StellarTerm</MenuItem>
                        <MenuItem eventKey={3.3}>Stats</MenuItem>
                    </NavDropdown>
                </Nav>
                <Nav pullRight>
                    <SearchBox/>
                </Nav>
            </Navbar>
        </div>
    )
  }
}

export default Header
