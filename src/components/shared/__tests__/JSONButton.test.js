import React from 'react'
import {shallow} from 'enzyme'

import JSONButton from '../JSONButton'

it('renders button with given url', () => {
  const url = `https://somebackend.xyz/resource/12345`
  const btn = shallow(<JSONButton url={url} />)
  expect(btn.find('BadgeButton').props().url).toEqual(url)
  expect(btn.getNodes()).toMatchSnapshot()
})
