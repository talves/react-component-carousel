import React from 'react'
import ReactDOM from 'react-dom'
import SlideWrapper from '../../components/slide-wrapper'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <SlideWrapper>
      <div>Test</div>
    </SlideWrapper>,
    div,
  )
  ReactDOM.unmountComponentAtNode(div)
})
