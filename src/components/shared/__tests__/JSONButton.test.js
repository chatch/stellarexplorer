import React from 'react'
import {configure, shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import JSONButton from '../JSONButton'

configure({adapter: new Adapter()})

it('renders button with given url', () => {
  const url = 'https://somebackend.xyz/resource/12345'

  const btn = shallow(<JSONButton url={url} />)
  expect(btn.props().url).toEqual(url)

  expect(btn.getElements()).toMatchSnapshot()
})
