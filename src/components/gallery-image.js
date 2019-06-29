import React from 'react'
import PropTypes from 'prop-types'

function GalleryImage({item, onImageLoad, onError}) {
  return (
    <div className="component-carousel__image">
      {item.imageSet ? (
        <picture onLoad={onImageLoad} onError={onError}>
          {item.imageSet.map((source, index) => (
            <source
              key={index}
              media={source.media}
              srcSet={source.srcSet}
              type={source.type}
            />
          ))}
          <img alt={item.originalAlt} src={item.original} />
        </picture>
      ) : (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <img
          src={item.original}
          alt={item.originalAlt}
          srcSet={item.srcSet}
          sizes={item.sizes}
          title={item.originalTitle}
          onLoad={onImageLoad}
          onError={onError}
        />
      )}

      {item.description && (
        <span className="component-carousel__description">
          {item.description}
        </span>
      )}
    </div>
  )
}

GalleryImage.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
  onError: PropTypes.func,
  onImageLoad: PropTypes.func,
}

export default GalleryImage
