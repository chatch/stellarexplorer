import React from 'react'
import {shallow} from 'enzyme'

import knownAccounts from '../../../data/known_accounts'
import AccountLink from '../AccountLink'

const ACC_KNOWN = Object.keys(knownAccounts)[0]
const ACC_UNKNOWN = 'GCGG3CIRBG2TTBR4HYZJ7JLDRFKZIYOAHFXRWLU62CA2QN52P2SUQNPJ'
const LABEL = 'Anchor'

it('renders with label', () => {
  const link = shallow(<AccountLink label={LABEL} account={ACC_UNKNOWN} />)
  expect(link.getNodes()).toMatchSnapshot()
})

it('renders short account for label when no label property', () => {
  const link = shallow(<AccountLink account={ACC_UNKNOWN} />)
  expect(link.getNodes()).toMatchSnapshot()
})

it('renders anchor name in italics if account a known anchor', () => {
  const anchorName = knownAccounts[ACC_KNOWN].name

  const link = shallow(<AccountLink account={ACC_KNOWN} />)
  const nameEl = link.find('Link > span')

  expect(nameEl.text()).toEqual(anchorName)
  expect(nameEl.props().style.fontStyle).toEqual('italic')
  expect(link.getNodes()).toMatchSnapshot()
})
