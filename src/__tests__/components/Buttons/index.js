import React from 'react'
import ReactDOM from 'react-dom'
import {
  FullscreenButton,
  NavButton,
  PlayPauseButton,
} from '../../../components/Buttons'

test('FullscreenButton should be tested', () => {
  expect(FullscreenButton).toBeDefined()
})
it('FullscreenButton renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<FullscreenButton />, div)
  ReactDOM.unmountComponentAtNode(div)
})
test('NavButton should be tested', () => {
  expect(NavButton).toBeDefined()
})
it('NavButton renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<NavButton />, div)
  ReactDOM.unmountComponentAtNode(div)
})
test('PlayPauseButton should be tested', () => {
  expect(PlayPauseButton).toBeDefined()
})
it('PlayPauseButton renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<PlayPauseButton />, div)
  ReactDOM.unmountComponentAtNode(div)
})
