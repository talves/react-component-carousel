import {renderHook, act} from '@testing-library/react-hooks'
import usePrevious from '../../utils/usePrevious'

test('usePrevious should be tested', () => {
  expect(usePrevious).toBeDefined()
})
test('should use ref', () => {
  const {result, rerender} = renderHook(() => usePrevious(0))
  expect(result.current).toBe(undefined)
  act(() => {
    rerender()
  })
  expect(result.current).toBe(0)
})
