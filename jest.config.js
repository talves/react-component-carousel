const jestConfig = require('ada-scripts/jest')
jestConfig.transform['.+\\.(css|styl|less|sass|scss)$'] = require.resolve(
  './__mocks__/styleMock.js',
)

const newConfig = Object.assign(jestConfig, {
  roots: ['./src'],
  displayName: 'react-component-carousel',
})
module.exports = newConfig
