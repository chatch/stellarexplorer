import React from 'react'
import ReactDOM from 'react-dom'
import App from '../App'

import '../__mocks__/MockXHR.js'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})
