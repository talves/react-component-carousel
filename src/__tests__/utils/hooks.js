import {usePrevious, useWindowSize, useComponentSize} from '../../utils/hooks'

test('usePrevious should be tested', () => {
  expect(usePrevious).toBeDefined()
})
test('useWindowSize should be tested', () => {
  expect(useWindowSize).toBeDefined()
})
test('useComponentSize should be tested', () => {
  expect(useComponentSize).toBeDefined()
})
