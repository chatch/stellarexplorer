import type { MouseEventHandler } from 'react'
import { NavDropdown } from 'react-bootstrap'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavItem from 'react-bootstrap/NavItem'
import { FormattedMessage, useIntl } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import logoImg from '../../img/logo.png'
import LanguageSelector from './LanguageSelector'
import NetworkSelector from './NetworkSelector'
import { NetworkKey } from '~/lib/stellar/networks'

interface HeaderProps {
  languageSwitcher: MouseEventHandler
  networkType: NetworkKey
  networkIsLocal: boolean
}

export default function Header({
  languageSwitcher,
  networkType,
  networkIsLocal
}: HeaderProps) {
  const { formatMessage } = useIntl()
  return (
    <Navbar collapseOnSelect expand="xxl" fixed="top">
      <Navbar.Brand href="/">
        <img
          src={logoImg}
          className="App-logo"
          alt={formatMessage({ id: "logo" })}
        />
        <span className="brand-text">explorer</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      {/* bsPrefix="navbar-toggler-steexp" */}

      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">

          <Nav.Link href="/operations">
            <FormattedMessage id="operations" />
          </Nav.Link>
          <Nav.Link href="/txs">
            <FormattedMessage id="transactions" />
          </Nav.Link>
          <Nav.Link href="/ledgers">
            <FormattedMessage id="ledgers" />
          </Nav.Link>

          <div className="divider-vertical" />

          <Nav.Link href="/assets">
            <FormattedMessage id="assets" />
          </Nav.Link>
          <Nav.Link href="/anchors">
            <FormattedMessage id="anchors" />
          </Nav.Link>
          <Nav.Link href="/exchanges">
            <FormattedMessage id="exchanges" />
          </Nav.Link>

          <div className="divider-vertical" />

          <NavDropdown
            title={formatMessage({ id: "more" })}
            id="basic-nav-dropdown"
          >
            <LinkContainer to="/effects">
              <NavDropdown.Item>
                <FormattedMessage id="effects" />
              </NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/payments">
              <NavDropdown.Item>
                <FormattedMessage id="payments" />
              </NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/trades">
              <NavDropdown.Item>
                <FormattedMessage id="trades" />
              </NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
        </Nav>
        <Nav className="ms-auto">
          <NavItem>
            <NetworkSelector
              networkType={networkType}
              networkIsLocal={networkIsLocal}
            />
          </NavItem>
          <NavItem>
            <LanguageSelector switcher={languageSwitcher} />
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}