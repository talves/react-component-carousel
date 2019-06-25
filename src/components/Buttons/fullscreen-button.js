import React from 'react'

function FullscreenButton({ renderer, onClick, className, active, ...props }, ref) {
  if (renderer) return renderer({onClick, className, active, ...props}, ref)
  return (
    <button
      ref={ref}
      type="button"
      className={className}
      onClick={onClick}
      {...props}
      aria-label="Open Fullscreen"
    />
  )
}

export default React.forwardRef(FullscreenButton)
