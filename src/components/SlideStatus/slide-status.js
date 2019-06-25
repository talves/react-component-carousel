import React from 'react'

function SlideStatus({ current, separator, total }) {

  return (
    <div className="component-carousel__slide-status">
      <span className="component-carousel__slide-status-current">
        {current}
      </span>
      <span className="component-carousel__slide-status-separator">
        {separator}
      </span>
      <span className="component-carousel__slide-status-total">{total}</span>
    </div>
  )
}

export default SlideStatus
