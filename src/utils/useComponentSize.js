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
  const [componentSize, setComponentSize] = React.useState(getSize(ref ? ref.current : {}))

  const handleResize = React.useCallback(
    function handleResize() {
      if (ref.current) {
        setComponentSize(getSize(ref.current))
      }
    },
    [ref]
  )

  React.useLayoutEffect(() => {
    if (!ref.current) return
    const currentReference = ref.current

    handleResize()

    if (typeof ResizeObserver === 'function') {
      let resizeObserver = new ResizeObserver(() => handleResize())
      resizeObserver.observe(currentReference)

      return () => {
        resizeObserver.disconnect(currentReference)
        resizeObserver = null
      }
    } else {
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [ref.current])

  return componentSize
}

export default useComponentSize
