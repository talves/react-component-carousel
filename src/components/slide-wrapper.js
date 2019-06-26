import React from 'react'
import PropTypes from 'prop-types'
import { useComponentSize } from '../utils/hooks'

const SlideWrapper = ({
  children,
  onSizeChange,
  ...props
 }) => {
  const wrapperRef = React.useRef(null)
  // const [size, setSize] = React.useState({ height: null, width: null })
  const componentSize = useComponentSize(wrapperRef); // A custom Hook

  function handleSizeChange() {
    if (typeof onSizeChange === 'function') onSizeChange({...componentSize})
  }

  React.useEffect(() => {
    handleSizeChange()
  }, [componentSize])

  return (
    <div ref={wrapperRef} {...props}>
      {children}
    </div>
  )
}

SlideWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  onSizeChange: PropTypes.func
}

export default SlideWrapper
