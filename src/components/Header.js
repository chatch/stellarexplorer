import React from 'react'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import SearchBox from './SearchBox'

class Header extends React.Component {
  render() {
    const placeHolderText = "Search on Account ID / Transaction Hash / etc."
    return (
        <div>
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">
                            <ruby style={{rubyPosition:'under'}}>
                                Stellar Graph<rt>testnet</rt>
                            </ruby>
                        </Link>
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
    )
  }
}

export default Header
