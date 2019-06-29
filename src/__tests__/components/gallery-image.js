import React from 'react'
import ReactDOM from 'react-dom'
import GalleryImage from '../../components/gallery-image'

const item = {
  imageSet: [],
}
it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<GalleryImage item={item} />, div)
  ReactDOM.unmountComponentAtNode(div)
})
