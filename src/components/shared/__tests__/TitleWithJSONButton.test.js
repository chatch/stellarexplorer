import React from 'react'
import {shallow} from 'enzyme'

import {TitleWithJSONButton} from '../TitleWithJSONButton'

it('renders button with given url', () => {
  const url = 'https://somebackend.xyz/ledger/12345'
  const title = 'Ledger'
  const btn = shallow(<TitleWithJSONButton title={title} url={url} />)
  expect(btn.find('JSONButton').props().url).toEqual(url)
  expect(btn.getNodes()).toMatchSnapshot()
})
