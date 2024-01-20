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
import ThemeSwitcher from './ThemeSwitcher'
import type { NetworkDetails } from '~/lib/stellar/networks'

interface HeaderProps extends NetworkDetails {
  languageSwitcher: MouseEventHandler
}

export default function Header({
  languageSwitcher,
  networkType,
  isLocal,
  isCustom,
  customHorizonAddress,
  customSorobanRPCAddress,
}: Readonly<HeaderProps>) {
  const { formatMessage } = useIntl()

  return (
    <Navbar collapseOnSelect expand="xxl" fixed="top">
      <Navbar.Brand href="/">
        <img
          src={logoImg}
          className="App-logo"
          alt={formatMessage({ id: 'logo' })}
        />
        <span className="brand-text">explorer</span>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />

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
            title={formatMessage({ id: 'more' })}
            id="basic-nav-dropdown"
            className="nav-dropdown"
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
            <LinkContainer to="/pools">
              <NavDropdown.Item>
                <FormattedMessage id="liquidity-pools" />
              </NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/claimable-balances">
              <NavDropdown.Item>
                <FormattedMessage id="claimable-balances" />
              </NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
        </Nav>
        <Nav className="ms-auto">
          <NavItem>
            <NetworkSelector
              networkType={networkType}
              isLocal={isLocal}
              isCustom={isCustom}
              customHorizonAddress={customHorizonAddress}
              customSorobanRPCAddress={customSorobanRPCAddress}
            />
          </NavItem>
          <NavItem className="theme-selector-wrapper">
            <ThemeSwitcher />
          </NavItem>
          <NavItem>
            <LanguageSelector switcher={languageSwitcher} />
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
