import React from 'react'
import ReactDOM from 'react-dom'
import SlideStatus from '../../../components/SlideStatus'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<SlideStatus />, div)
  ReactDOM.unmountComponentAtNode(div)
})
