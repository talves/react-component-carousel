import React from 'react'

function PlayPauseButton({ renderer, onClick, className, active, ...props }) {
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

export default PlayPauseButton
