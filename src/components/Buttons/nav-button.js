import React from 'react'
import PropTypes from 'prop-types'

function NavButton({
  renderer,
  onClick,
  className,
  disabled,
  direction,
  ...props
}) {
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

NavButton.propTypes = {
  renderer: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  direction: PropTypes.string,
  onClick: PropTypes.func,
}

export default NavButton
