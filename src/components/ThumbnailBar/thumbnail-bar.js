import React from 'react'
import PropTypes from 'prop-types'
import { useComponentSize } from '../../utils/hooks'
import ThumbnailInner from './thumbnail-inner'

function ThumbnailBar({
  useTranslate3D = true,
  isRTL = true,
  thumbnailPosition = 'bottom',
  disableThumbnailScroll = false,
  renderThumbInner,
  currentIndex = 0,
  height = 0,
  items = [],
  onThumbClicked,
  slideOnThumbnailOver = false,
  onError,
  disabled = false,
  ...props
 }) {
  const wrapperRef = React.useRef(null)
  const containerRef = React.useRef(null)
  const [clickedIndex, setClickedIndex] = React.useState(currentIndex)
  const [previousIndex, setPreviousIndex] = React.useState(currentIndex)
  const [thumbnailsCount, setThumbnailsCount] = React.useState(0)
  const [thumbnailStyle, setThumbnailStyle] = React.useState([])
  const [thumbsTranslate, setThumbsTranslate] = React.useState(0)
  const [thumbnailsScrollHeight, setThumbnailsScrollHeight] = React.useState(0)
  const [thumbnailsScrollWidth, setThumbnailsScrollWidth] = React.useState(0)
  const [thumbnailsWrapperWidth, setThumbnailsWrapperWidth] = React.useState(0)
  const [thumbnailsWrapperHeight, setThumbnailsWrapperHeight] = React.useState(0)
  const [thumbnailBarStyle, setThumbnailBarStyle] = React.useState({})
  const [isThumbnailVertical, setIsThumbnailVertical] = React.useState(false)

  const wrapperSize = useComponentSize(wrapperRef); // A custom Hook
  const containerSize = useComponentSize(containerRef); // A custom Hook

  const getThumbsTranslate = indexDifference => {
    if (disableThumbnailScroll) return 0

    let totalScroll

    if (containerRef) {
      // total scroll required to see the last thumbnail
      if (isThumbnailVertical) {
        if (thumbnailsScrollHeight <= thumbnailsWrapperHeight) {
          return 0
        }
        totalScroll = thumbnailsScrollHeight - thumbnailsWrapperHeight
      } else {
        if (
          thumbnailsScrollWidth <= thumbnailsWrapperWidth ||
          thumbnailsWrapperWidth <= 0
        ) {
          return 0
        }
        totalScroll = thumbnailsScrollWidth - thumbnailsWrapperWidth
      }

      // scroll-x required per index change
      let perIndexScroll = totalScroll / (thumbnailsCount - 1)

      return indexDifference * perIndexScroll
    }
  }

  const handleThumbnailClick = function(index) { 
    return event => {
      event.preventDefault()
      if (disabled) return
      setClickedIndex(index)
    }
  }

  const handleThumbnailMouseLeave = function(index) {
    return event => {
      event.preventDefault()
      if (!slideOnThumbnailOver || disabled) return
      setClickedIndex(index)
    }
  }

  const handleThumbnailMouseOver = function(index) {
    return event => {
      event.preventDefault()
      if (!slideOnThumbnailOver || disabled) return
      if (index === currentIndex) return
      setClickedIndex(index)
    }
  }

  const handleTranslate = function() {
    if (currentIndex === 0) {
      setThumbsTranslate(0)
    } else {
      let indexDifference = Math.abs(previousIndex - currentIndex)
      let scroll = getThumbsTranslate(indexDifference)
      if (scroll > 0) {
        if (previousIndex < currentIndex) {
          setThumbsTranslate(thumbsTranslate - scroll)
        } else if (previousIndex > currentIndex) {
          setThumbsTranslate(thumbsTranslate + scroll)
        }
      }
    }
  }

  React.useEffect(() => {
    setThumbnailsWrapperWidth(wrapperSize.width)
    setThumbnailsWrapperHeight(wrapperSize.height)
  }, [wrapperSize])

  React.useEffect(() => {
    setIsThumbnailVertical(thumbnailPosition === 'left' || thumbnailPosition === 'right')
    handleTranslate()
  }, [thumbnailPosition])

  React.useEffect(() => {
    setThumbnailsScrollHeight(containerSize.scrollHeight ? containerSize.scrollHeight : 0)
    setThumbnailsScrollWidth(containerSize.scrollWidth ? containerSize.scrollWidth : 0)
  }, [containerSize])

  React.useEffect(() => {
    setThumbnailsCount(items ? items.length : 0)
  }, [items])

  /**
   * Clicked index fires on Thumb Clicked event
   */
  React.useEffect(() => {
    if (typeof onThumbClicked === 'function') onThumbClicked(clickedIndex)
  }, [clickedIndex])

  /**
   * Current index changed, update thumbnails view
   */
  React.useEffect(() => {
    handleTranslate()
    setPreviousIndex(currentIndex)
  }, [currentIndex])

  /**
   * Replaces getThumbnailStyle, updates on settings changed
   */
  React.useEffect(() => {
    let translate
    const verticalTranslateValue = isRTL
      ? thumbsTranslate * -1
      : thumbsTranslate

    if (isThumbnailVertical) {
      translate = `translate(0, ${thumbsTranslate}px)`
      if (useTranslate3D) {
        translate = `translate3d(0, ${thumbsTranslate}px, 0)`
      }
    } else {
      translate = `translate(${verticalTranslateValue}px, 0)`
      if (useTranslate3D) {
        translate = `translate3d(${verticalTranslateValue}px, 0, 0)`
      }
    }
    setThumbnailStyle({
      WebkitTransform: translate,
      MozTransform: translate,
      msTransform: translate,
      OTransform: translate,
      transform: translate,
    })
  }, [useTranslate3D, isRTL, thumbsTranslate])

  React.useEffect(() => {
    setThumbnailBarStyle(isThumbnailVertical
      ? { height: `${height}px` }
      : { }
    )
  }, [height])

    /**
   * Control functions
   */
  const isActive = index => index === currentIndex

  return (
    <div
      className={`component-carousel__thumbnails-wrapper ${thumbnailPosition} ${
        !isThumbnailVertical && isRTL ? 'thumbnails-wrapper-rtl' : ''
      }`}
      style={thumbnailBarStyle}
    >
      <div className="component-carousel__thumbnails" ref={wrapperRef}>
        <div
          ref={containerRef}
          className="component-carousel__thumbnails-container"
          style={thumbnailStyle}
          aria-label={`Thumbnail Navigation on ${thumbnailPosition}`}
        >
          {items && items.map((item, index) => {
            const ItemRenderThumbInner =
              item.renderThumbInner || renderThumbInner || ThumbnailInner
            const thumbnailClass = item.thumbnailClass
              ? ` ${item.thumbnailClass}`
              : ''
            return (
              <a
                key={index}
                role="button"
                aria-pressed={isActive(index) ? 'true' : 'false'}
                aria-label={`Go to Slide ${index + 1}`}
                className={`component-carousel__thumbnail${isActive(index) ? ' active' : ''}${thumbnailClass}`}
                onMouseLeave={slideOnThumbnailOver ? handleThumbnailMouseLeave(index) : undefined}
                onMouseMove={slideOnThumbnailOver ? handleThumbnailMouseLeave(index) : undefined}
                onMouseOver={slideOnThumbnailOver ? handleThumbnailMouseOver(index) : undefined}
                onClick={!slideOnThumbnailOver ? handleThumbnailClick(index) : undefined}
              >
                {ItemRenderThumbInner({item, onError})}
              </a>
            )
          })
        }
        </div>
      </div>
    </div>
  )
}

ThumbnailBar.propTypes = {
  items: PropTypes.array.isRequired,
  useTranslate3D: PropTypes.bool,
  isRTL: PropTypes.bool,
  thumbnailPosition: PropTypes.string,
  disableThumbnailScroll: PropTypes.bool,
  currentIndex: PropTypes.number,
  height: PropTypes.number,
  renderThumbInner: PropTypes.func,
  onThumbnailClick: PropTypes.func,
  slideOnThumbnailOver: PropTypes.bool,
  onError:  PropTypes.func,
  disabled:  PropTypes.bool,
}

export default ThumbnailBar
