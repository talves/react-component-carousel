import React from 'react'

function getSize(el) {
  if (!el) return {width: 0, height: 0}

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
    scrollWidth: el.scrollWidth,
    scrollHeight: el.scrollHeight
  }
}

function useComponentSize(ref) {
  let [ComponentSize, setComponentSize] = React.useState(getSize(ref ? ref.current : {}))

  const handleResize = React.useCallback(
    function handleResize() {
      if (ref.current) {
        setComponentSize(getSize(ref.current))
      }
    }, [ref])

    React.useLayoutEffect(() => {
    if (!ref.current) return

    handleResize()

    if (typeof ResizeObserver === 'function') {
      let resizeObserver = new ResizeObserver(() => handleResize())
      resizeObserver.observe(ref.current)

      return () => {
        resizeObserver.disconnect(ref.current)
        resizeObserver = null
      }
    } else {
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [ref.current])

  return ComponentSize
}

export default useComponentSize
