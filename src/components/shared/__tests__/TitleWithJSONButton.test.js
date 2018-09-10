import React from 'react'
import {configure, shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {TitleWithJSONButton} from '../TitleWithJSONButton'

configure({adapter: new Adapter()})

it('renders button with given url', () => {
  const url = 'https://somebackend.xyz/ledger/12345'
  const title = 'Ledger'
  const btn = shallow(<TitleWithJSONButton title={title} url={url} />)
  expect(btn.find('JSONButton').props().url).toEqual(url)
  expect(btn.getElements()).toMatchSnapshot()
})
