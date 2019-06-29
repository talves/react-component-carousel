const jestConfig = require('ada-scripts/jest')
jestConfig.transform['.+\\.(css|styl|less|sass|scss)$'] = require.resolve(
  './__mocks__/styleMock.js',
)

const newConfig = Object.assign(jestConfig, {
  roots: ['./src'],
  displayName: 'react-component-carousel',
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 40,
      functions: 50,
      lines: 50,
    },
  },
})
module.exports = newConfig
