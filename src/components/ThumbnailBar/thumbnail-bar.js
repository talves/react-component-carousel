import React from 'react'
import PropTypes from 'prop-types'
import {usePrevious, useComponentSize} from '../../utils/hooks'
import ThumbnailInner from './thumbnail-inner'

// eslint-disable-next-line max-lines-per-function
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
}) {
  const wrapperRef = React.useRef(null)
  const containerRef = React.useRef(null)
  const [clickedIndex, setClickedIndex] = React.useState(currentIndex)
  const previousIndex = usePrevious(currentIndex)
  const [thumbnailsCount, setThumbnailsCount] = React.useState(0)
  const [thumbnailStyle, setThumbnailStyle] = React.useState([])
  const [thumbsTranslate, setThumbsTranslate] = React.useState(0)
  const [thumbnailsScrollHeight, setThumbnailsScrollHeight] = React.useState(0)
  const [thumbnailsScrollWidth, setThumbnailsScrollWidth] = React.useState(0)
  const [thumbnailsWrapperWidth, setThumbnailsWrapperWidth] = React.useState(0)
  const [thumbnailsWrapperHeight, setThumbnailsWrapperHeight] = React.useState(
    0,
  )
  const [thumbnailBarStyle, setThumbnailBarStyle] = React.useState({})
  const [isThumbnailVertical, setIsThumbnailVertical] = React.useState(false)

  const wrapperSize = useComponentSize(wrapperRef) // A custom Hook
  const containerSize = useComponentSize(containerRef) // A custom Hook

  const handleThumbnailClick = index => {
    return event => {
      event.preventDefault()
      if (disabled) return
      setClickedIndex(index)
    }
  }

  const handleThumbnailMouseLeave = index => {
    return event => {
      event.preventDefault()
      if (!slideOnThumbnailOver || disabled) return
      setClickedIndex(index)
    }
  }

  const handleThumbnailMouseOver = index => {
    return event => {
      event.preventDefault()
      if (!slideOnThumbnailOver || disabled) return
      if (index === currentIndex) return
      setClickedIndex(index)
    }
  }

  React.useEffect(() => {
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
        const perIndexScroll = totalScroll / (thumbnailsCount - 1)

        return indexDifference * perIndexScroll
      }
      return 0
    }
    if (currentIndex === 0) {
      setThumbsTranslate(0)
    } else {
      const indexDifference = Math.abs(previousIndex - currentIndex)
      const scroll = getThumbsTranslate(indexDifference)
      if (scroll > 0) {
        if (previousIndex < currentIndex) {
          setThumbsTranslate(thumbsTranslate - scroll)
        } else if (previousIndex > currentIndex) {
          setThumbsTranslate(thumbsTranslate + scroll)
        }
      }
    }
  }, [
    currentIndex,
    disableThumbnailScroll,
    isThumbnailVertical,
    previousIndex,
    thumbnailPosition,
    thumbnailsCount,
    thumbnailsScrollHeight,
    thumbnailsScrollWidth,
    thumbnailsWrapperHeight,
    thumbnailsWrapperWidth,
    thumbsTranslate,
  ])

  React.useEffect(() => {
    setThumbnailsWrapperWidth(wrapperSize.width)
    setThumbnailsWrapperHeight(wrapperSize.height)
  }, [wrapperSize])

  React.useEffect(() => {
    setIsThumbnailVertical(
      thumbnailPosition === 'left' || thumbnailPosition === 'right',
    )
  }, [thumbnailPosition])

  React.useEffect(() => {
    setThumbnailsScrollHeight(
      containerSize.scrollHeight ? containerSize.scrollHeight : 0,
    )
    setThumbnailsScrollWidth(
      containerSize.scrollWidth ? containerSize.scrollWidth : 0,
    )
  }, [containerSize])

  React.useEffect(() => {
    setThumbnailsCount(items ? items.length : 0)
  }, [items])

  /**
   * Clicked index fires on Thumb Clicked event
   */
  React.useEffect(() => {
    if (typeof onThumbClicked === 'function') onThumbClicked(clickedIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedIndex])

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
  }, [useTranslate3D, isRTL, thumbsTranslate, isThumbnailVertical])

  React.useEffect(() => {
    setThumbnailBarStyle(isThumbnailVertical ? {height: `${height}px`} : {})
  }, [height, isThumbnailVertical])

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
          {items &&
            items.map((item, index) => {
              const itemRenderThumbInner =
                item.renderThumbInner || renderThumbInner || ThumbnailInner
              const thumbnailClass = item.thumbnailClass
                ? ` ${item.thumbnailClass}`
                : ''
              return (
                <div
                  key={index}
                  role="button"
                  tabIndex={index}
                  aria-pressed={isActive(index) ? 'true' : 'false'}
                  aria-label={`Go to Slide ${index + 1}`}
                  className={`component-carousel__thumbnail${
                    isActive(index) ? ' active' : ''
                  }${thumbnailClass}`}
                  onMouseLeave={
                    slideOnThumbnailOver
                      ? handleThumbnailMouseLeave(index)
                      : undefined
                  }
                  onMouseMove={
                    slideOnThumbnailOver
                      ? handleThumbnailMouseLeave(index)
                      : undefined
                  }
                  onMouseOver={
                    slideOnThumbnailOver
                      ? handleThumbnailMouseOver(index)
                      : undefined
                  }
                  onClick={handleThumbnailClick(index)}
                  onFocus={handleThumbnailClick(index)}
                  onKeyDown={() => {}}
                >
                  {itemRenderThumbInner({item, onError})}
                </div>
              )
            })}
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
  onThumbClicked: PropTypes.func,
  slideOnThumbnailOver: PropTypes.bool,
  onError: PropTypes.func,
  disabled: PropTypes.bool,
}

export default ThumbnailBar
