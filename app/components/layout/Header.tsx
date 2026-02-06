import type { MouseEventHandler } from 'react'
import { NavDropdown } from 'react-bootstrap'
import { Nav, Navbar } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from '@remix-run/react'

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
            <NavDropdown.Item as={Link} to="/effects">
              <FormattedMessage id="effects" />
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/payments">
              <FormattedMessage id="payments" />
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/trades">
              <FormattedMessage id="trades" />
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/pools">
              <FormattedMessage id="liquidity-pools" />
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/claimable-balances">
              <FormattedMessage id="claimable-balances" />
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Item>
            <NetworkSelector
              networkType={networkType}
              isLocal={isLocal}
              isCustom={isCustom}
              customHorizonAddress={customHorizonAddress}
              customSorobanRPCAddress={customSorobanRPCAddress}
            />
          </Nav.Item>
          <Nav.Item className="theme-selector-wrapper">
            <ThemeSwitcher />
          </Nav.Item>
          <Nav.Item>
            <LanguageSelector switcher={languageSwitcher} />
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
