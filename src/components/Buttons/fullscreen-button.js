import React from 'react'
import PropTypes from 'prop-types'

function FullscreenButton({ renderer, onClick, className, active, ...props }) {
  if (renderer) return renderer({onClick, className, active, ...props})

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      {...props}
      aria-label="Open Fullscreen"
    />
  )
}

FullscreenButton.propTypes = {
  renderer: PropTypes.func,
  active: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
}

export default FullscreenButton
