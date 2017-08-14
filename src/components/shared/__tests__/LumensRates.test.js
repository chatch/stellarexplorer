import React from 'react'
import {shallow} from 'enzyme'
import {LumensRates} from '../LumensRates'

it('render positive change in rate', () => {
  const rate = shallow(<LumensRates change="2.1" usd="0.020" />)
  const changeEl = rate.find('span[style]')
  expect(changeEl.props().style.color).toEqual('green')
  expect(rate.getNodes()).toMatchSnapshot()
})

it('render negative change in rate', () => {
  const rate = shallow(<LumensRates change="-1.52" usd="0.025" />)
  const changeEl = rate.find('span[style]')
  expect(changeEl.props().style.color).toEqual('red')
  expect(rate.getNodes()).toMatchSnapshot()
})
