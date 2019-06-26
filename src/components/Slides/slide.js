import React from 'react'
import PropTypes from 'prop-types'

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
  onFocus,
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
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onTransitionEnd={onSlideTransitionEnd(index)}
      role={onSlideClick && 'button'}
    >
      {children}
    </div>
  )
}

Slide.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  index: PropTypes.number,
  className: PropTypes.string,
  slideStyle: PropTypes.object,
  onSlideClick: PropTypes.func,
  onSlideTransitionEnd: PropTypes.func,
  onTouchMove: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onTouchStart: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onFocus: PropTypes.func,
}

export default Slide
