import React from 'react'
import {shallow} from 'enzyme'

import anchors from '../../../lib/anchors'
import AccountLink from '../AccountLink'

const anAccount = 'GCGG3CIRBG2TTBR4HYZJ7JLDRFKZIYOAHFXRWLU62CA2QN52P2SUQNPJ'
const aLabel = 'Anchor'

it('renders with label', () => {
  const link = shallow(<AccountLink label={aLabel} account={anAccount} />)
  expect(link.getNodes()).toMatchSnapshot()
})

it('renders short account for label when no label property', () => {
  const link = shallow(<AccountLink account={anAccount} />)
  expect(link.getNodes()).toMatchSnapshot()
})

it('renders anchor name in italics if account a known anchor', () => {
  const anchorAccount = Object.keys(anchors)[0] // pick the first one out
  const anchorName = anchors[anchorAccount].name

  const link = shallow(<AccountLink account={anchorAccount} />)
  const nameEl = link.find('Link > span')

  expect(nameEl.text()).toEqual(anchorName)
  expect(nameEl.props().style.fontStyle).toEqual('italic')
  expect(link.getNodes()).toMatchSnapshot()
})
