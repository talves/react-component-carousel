import React from 'react'

function getSize(el) {
  if (!el) return {
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollHeight: 0,
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
    scrollWidth: el.scrollWidth,
    scrollHeight: el.scrollHeight,
  }
}

const observerExists = typeof ResizeObserver === 'function'

function useComponentSize(ref) {
  const [componentSize, setComponentSize] = React.useState(
    getSize(ref && ref.current),
  )
  const [currentReference, setCurrentReference] = React.useState(
    ref && ref.current ? ref.current : null,
  )

  const handleResize = React.useCallback(
    function handleResize() {
      if (currentReference) {
        setComponentSize(getSize(currentReference))
      }
    },
    [currentReference],
  )

  React.useEffect(() => {
    setCurrentReference(ref.current ? ref.current : null)
  }, [ref.current])

  React.useLayoutEffect(() => {
    const cleanupReference = currentReference
    const currentHandler = handleResize
    let resizeObserver = null
    handleResize() // setInitial size; usually (0,0)

    if (observerExists && cleanupReference) {
      resizeObserver = new ResizeObserver(() => handleResize())
      resizeObserver.observe(cleanupReference)
    } else {
      window.addEventListener('resize', currentHandler)
    }
    return function cleanup() {
      if (observerExists && cleanupReference) {
        resizeObserver.disconnect(cleanupReference)
        resizeObserver = null
      } else {
        window.removeEventListener('resize', currentHandler)
      }
    }
  }, [handleResize])

  return componentSize
}

export default useComponentSize
