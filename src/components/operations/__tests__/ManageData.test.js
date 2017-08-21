import React from 'react'
import {shallow} from 'enzyme'

import ManageData from '../ManageData'

it('decodes ordinary string values', () => {
  const link = shallow(<ManageData name="lang" value="aW5kb25lc2lhbg==" />)
  expect(link.getNodes()).toMatchSnapshot()
})

it('decodes utf8 string values', () => {
  const link = shallow(<ManageData name="utf8value" value="6ams6ams6JmO6JmO" />)
  expect(link.getNodes()).toMatchSnapshot()
})

it('truncates a long key and long value', () => {
  const aLongPrefix = 'some_really_long_12345678901234567890123456789'
  const aLongName = `name_${aLongPrefix}`
  const aLongValue = Buffer.from(`value_${aLongPrefix}`).toString('base64')
  const link = shallow(<ManageData name={aLongName} value={aLongValue} />)
  expect(link.getNodes()).toMatchSnapshot()
})
