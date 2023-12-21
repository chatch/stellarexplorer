import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import type { KnownAccountProps } from '../../../data/known_accounts'
import knownAccounts from '../../../data/known_accounts'
import AccountLink, { BaseAccountLink } from '../AccountLink'

interface TKnownAccountProps extends KnownAccountProps {
  displayName: string
}

const ACC_KNOWN = Object.keys(knownAccounts).find(
  (key) => (knownAccounts[key] as TKnownAccountProps).displayName === 'NaoBTC',
) as string
const ACC_UNKNOWN = 'GCGG3CIRBG2TTBR4HYZJ7JLDRFKZIYOAHFXRWLU62CA2QN52P2SUQNPJ'
const LABEL = 'Anchor'

describe('AccountLink', () => {
  it('renders with label', () => {
    render(
      <BrowserRouter>
        <AccountLink label={LABEL} account={ACC_UNKNOWN} />
      </BrowserRouter>,
    )

    expect(screen.getByText(LABEL)).toBeInTheDocument()
  })

  it('renders short account for label when no label property', () => {
    render(
      <BrowserRouter>
        <AccountLink account={ACC_UNKNOWN} />
      </BrowserRouter>,
    )

    expect(screen.getByText(ACC_UNKNOWN.slice(0, 4))).toBeInTheDocument()
  })

  it('renders anchor name in italics if account a known anchor', () => {
    render(
      <BrowserRouter>
        <BaseAccountLink label={''} address={ACC_KNOWN} hideKnown={false} />
      </BrowserRouter>,
    )

    expect(screen.getByText('NaoBTC')).toBeInTheDocument()
  })
})

describe('MuxedAccount', () => {
  it.todo('muxed account renders muxed and base')
})
