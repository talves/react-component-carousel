import React from 'react'
import PropTypes from 'prop-types'

function PlayPauseButton({renderer, onClick, className, active, ...props}) {
  if (renderer) return renderer({onClick, className, active, ...props})
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      {...props}
      aria-label="Play or Pause Slideshow"
    />
  )
}

PlayPauseButton.propTypes = {
  renderer: PropTypes.func,
  active: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
}

export default PlayPauseButton
