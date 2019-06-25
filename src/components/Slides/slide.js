import React from 'react'

function Slide({
  children,
  index,
  className,
  slideStyle,
  onSlideClick,
  onSlideTransitionEnd,
  onTouchMove,
  onTouchEnd,
  onTouchStart,
  onMouseOver,
  onMouseLeave,

}) {

  return (
    <div
      id={`component-carousel__slide-${index}`}
      className={className}
      style={slideStyle}
      onClick={onSlideClick}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onTransitionEnd={onSlideTransitionEnd(index)}
      role={onSlideClick && 'button'}
    >
      {children}
    </div>
  )
}

export default Slide
