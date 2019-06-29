import React from 'react'
import ReactDOM from 'react-dom'
import BulletBar from '../../../components/BulletBar'

const IMAGE_URL = 'https://via.placeholder.com/150'
const THUMB_URL = 'https://via.placeholder.com/150'

const images = []
for (let i = 1; i < 12; i++) {
  images.push({
    original: `${IMAGE_URL}`,
    thumbnail: `${THUMB_URL}`,
  })
}

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<BulletBar items={images} />, div)
  ReactDOM.unmountComponentAtNode(div)
})
