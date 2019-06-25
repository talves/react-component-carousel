import React from 'react'
import { useComponentSize } from '../utils/hooks'

const SlideWrapper = ({
  children,
  onSizeChange,
  ...props
 }) => {
  const wrapperRef = React.useRef(null)
  // const [size, setSize] = React.useState({ height: null, width: null })
  const componentSize = useComponentSize(wrapperRef); // A custom Hook

  React.useEffect(() => {
    if (typeof onSizeChange === 'function') onSizeChange({...componentSize})
  }, [componentSize])

  return (
    <div ref={wrapperRef} {...props}>
      {children}
    </div>
  )
}

export default SlideWrapper
