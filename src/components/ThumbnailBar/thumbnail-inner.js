import React from 'react'
import PropTypes from 'prop-types'

function ThumbnailInner({
  item,
  onError
}) {
  if (!item) return
  return (
    <div className="component-carousel__thumbnail-inner">
      <img
        src={item.thumbnail}
        alt={item.thumbnailAlt}
        title={item.thumbnailTitle}
        onError={onError}
      />
      {item.thumbnailLabel && (
        <div className="component-carousel__thumbnail-label">
          {item.thumbnailLabel}
        </div>
      )}
    </div>
  )
}

ThumbnailInner.propTypes = {
  item: PropTypes.object,
  onError: PropTypes.func
}

export default ThumbnailInner
