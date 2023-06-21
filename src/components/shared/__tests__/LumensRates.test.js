import React from 'react'
import {configure, shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {LumensRates} from '../LumensRates'

configure({adapter: new Adapter()})

describe('LumensRates', () => {
  it('render positive change in rate', () => {
    const rate = shallow(<LumensRates change="2.1" usd="0.020" />)
    const changeEl = rate.find('span[style]')
    expect(changeEl.props().style.color).toEqual('#00c292')
    expect(rate.getElements()).toMatchInlineSnapshot(`
    Array [
      <span>
        XLM/USD: 
        0.020
         
        <span
          style={
            Object {
              "color": "#00c292",
            }
          }
        >
          +2.1%
        </span>
      </span>,
    ]
  `)
  })

  it('render negative change in rate', () => {
    const rate = shallow(<LumensRates change="-1.52" usd="0.025" />)
    const changeEl = rate.find('span[style]')
    expect(changeEl.props().style.color).toEqual('#fb9678')
    expect(rate.getElements()).toMatchInlineSnapshot(`
    Array [
      <span>
        XLM/USD: 
        0.025
         
        <span
          style={
            Object {
              "color": "#fb9678",
            }
          }
        >
          -1.52%
        </span>
      </span>,
    ]
  `)
  })
})
