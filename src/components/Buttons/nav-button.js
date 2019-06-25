import React from 'react'

function NavButton({ renderer, onClick, className, disabled, direction, ...props }) {
  if (renderer) return renderer({onClick, className, disabled, ...props})
  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={onClick}
      {...props}
      aria-label={`${direction === 'left' ? 'Previous ' : 'Next '}Slide`}
    />
  )
}

export default NavButton
