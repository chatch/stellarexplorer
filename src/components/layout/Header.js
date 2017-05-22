import React from 'react'
import {Nav, Navbar, NavItem, MenuItem, NavDropdown, FormGroup} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import {isPubNet} from '../../lib/Stellar'
import SearchBox from './SearchBox'

class Header extends React.Component {
    render() {
        const netStr = (isPubNet)
            ? 'PUBLIC'
            : 'TESTNET'
        return (
            <Navbar fluid collapseOnSelect inverse>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">
                            <ruby style={{rubyPosition:'under'}}>
                                Stellar Graph<rt>{netStr}</rt>
                            </ruby>
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to="/ledgers">
                            <NavItem eventKey={1}>Ledgers</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/txs">
                            <NavItem eventKey={2}>Transactions</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/accounts">
                            <NavItem eventKey={3}>Accounts</NavItem>
                        </LinkContainer>
                        <NavDropdown eventKey={3} title="More" id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1} href="https://www.stellar.org/laboratory/">Laboratory</MenuItem>
                            <MenuItem eventKey={3.2} href="https://stellarterm.com/">StellarTerm</MenuItem>
                            <MenuItem eventKey={3.3}>Stats</MenuItem>
                        </NavDropdown>
                    </Nav>
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
