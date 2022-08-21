import React from 'react'
import {configure, shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import knownAccounts from '../../../data/known_accounts'
import AccountLink from '../AccountLink'

configure({adapter: new Adapter()})


const ACC_KNOWN = Object.keys(knownAccounts).find(key => knownAccounts[key].displayName === 'NaoBTC')
const ACC_UNKNOWN = 'GCGG3CIRBG2TTBR4HYZJ7JLDRFKZIYOAHFXRWLU62CA2QN52P2SUQNPJ'
const LABEL = 'Anchor'

it('renders with label', () => {
  const link = shallow(<AccountLink label={LABEL} account={ACC_UNKNOWN} />)
  expect(link.getElements()).toMatchSnapshot()
})

it('renders short account for label when no label property', () => {
  const link = shallow(<AccountLink account={ACC_UNKNOWN} />)
  expect(link.getElements()).toMatchSnapshot()
})

it('renders anchor name in italics if account a known anchor', () => {
  const anchorName = knownAccounts[ACC_KNOWN].name

  const link = shallow(<AccountLink account={ACC_KNOWN} />)
  const nameEl = link.find('Link > span')

  expect(nameEl.text()).toEqual(anchorName)
  expect(nameEl.props().style.fontStyle).toEqual('italic')
  expect(link.getElements()).toMatchSnapshot()
})
