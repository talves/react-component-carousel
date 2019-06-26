import React from 'react'
import PropTypes from 'prop-types'
import {Swipeable} from 'react-swipeable'
import GalleryImage from '../gallery-image'
import Slide from './slide'

const Wrapper = ({
  children,
  swipeable,
  flickThreshold,
  preventDefaultTouchmoveEvent,
  onSwipedLeft,
  onSwipedRight,
}) => {
  return swipeable ? (
    <Swipeable
      className="component-carousel__swipe"
      key="swipeable"
      delta={10}
      flickThreshold={flickThreshold}
      onSwipedLeft={onSwipedLeft}
      onSwipedRight={onSwipedRight}
      preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
      trackTouch={true}
      trackMouse={true}
    >
      <div className="component-carousel__slides">{children}</div>
    </Swipeable>
  ) : (
    <div className="component-carousel__slides">{children}</div>
  )
}

Wrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  swipeable: PropTypes.bool,
  flickThreshold: PropTypes.number,
  preventDefaultTouchmoveEvent: PropTypes.bool,
  onSwipedLeft: PropTypes.func,
  onSwipedRight: PropTypes.func,
}

const LEFT = 'left'
const CENTER = 'center'
const RIGHT = 'right'

function Slides({
  items = [],
  currentIndex = 0,
  previousIndex = 0,
  isRTL = false,
  lazyLoad,
  continuous = true,
  offsetPercentage = 0,
  renderItem,
  defaultImage,
  transitionStyle,
  onSlideClick,
  onTransitionEnd,
  onImageError,
  onImageLoad,
  onMouseLeave,
  onMouseOver,
  onFocus,
  useTranslate3D = true,
  swipeable = true,
  flickThreshold = 0.4,
  preventDefaultTouchmoveEvent = false,
  onSwipedLeft,
  onSwipedRight,
}) {
  const [lastIndex, setLastIndex] = React.useState(0)

  React.useEffect(() => {
    if (items.length) {
      setLastIndex(items.length > 0 ? items.length - 1 : 0)
    } else {
      setLastIndex(0)
    }
  }, [items.length])

  const handleSlideTransitionEnd = index => () => {
    if (index === lastIndex) {
      if (typeof onTransitionEnd === 'function') onTransitionEnd()
    }
  }

  const getAlignmentClassName = index => {
    // LEFT, and RIGHT alignments are necessary for lazy loading items
    let alignment = ''

    switch (index) {
      case currentIndex - 1:
        alignment = ` ${LEFT}`
        break
      case currentIndex:
        alignment = ` ${CENTER}`
        break
      case currentIndex + 1:
        alignment = ` ${RIGHT}`
        break
      default:
    }

    if (lastIndex >= 2 && continuous) {
      if (index === 0 && currentIndex === lastIndex) {
        // set first slide as right slide if were sliding right from last slide
        alignment = ` ${RIGHT}`
      } else if (index === lastIndex && currentIndex === 0) {
        // set last slide as left slide if were sliding left from first slide
        alignment = ` ${LEFT}`
      }
    }

    return alignment
  }

  const handleImageError = event => {
    if (defaultImage && event.target.src.indexOf(defaultImage) === -1) {
      event.target.src = defaultImage
    }
  }

  const getGalleryImage = item => {
    return (
      <GalleryImage
        item={item}
        onError={onImageError || handleImageError}
        onImageLoad={onImageLoad}
      />
    )
  }

  const getTranslateXForTwoSlide = index => {
    // For taking care of continuous swipe when there are only two slides
    const baseTranslateX = -100 * currentIndex
    let translateX = baseTranslateX + index * 100 + offsetPercentage

    let direction
    // keep track of user swiping direction
    if (offsetPercentage > 0) {
      direction = LEFT
    } else if (offsetPercentage < 0) {
      direction = RIGHT
    }

    // when swiping make sure the slides are on the correct side
    if (currentIndex === 0 && index === 1 && offsetPercentage > 0) {
      translateX = -100 + offsetPercentage
    } else if (currentIndex === 1 && index === 0 && offsetPercentage < 0) {
      translateX = 100 + offsetPercentage
    }

    if (currentIndex !== previousIndex) {
      // when swiped move the slide to the correct side
      if (
        previousIndex === 0 &&
        index === 0 &&
        offsetPercentage === 0 &&
        direction === LEFT
      ) {
        translateX = 100
      } else if (
        previousIndex === 1 &&
        index === 1 &&
        offsetPercentage === 0 &&
        direction === RIGHT
      ) {
        translateX = -100
      }
    } else {
      // keep the slide on the correct slide even when not a swipe
      if (
        currentIndex === 0 &&
        index === 1 &&
        offsetPercentage === 0 &&
        direction === LEFT
      ) {
        translateX = -100
      } else if (
        currentIndex === 1 &&
        index === 0 &&
        offsetPercentage === 0 &&
        direction === RIGHT
      ) {
        translateX = 100
      }
    }

    return translateX
  }

  const getSlideStyle = index => {
    const baseTranslateX = -100 * currentIndex

    // calculates where the other slides belong based on currentIndex
    // if it is RTL the base line should be reversed
    let translateX =
      (baseTranslateX + index * 100) * (isRTL ? -1 : 1) + offsetPercentage

    if (continuous && lastIndex > 1) {
      if (currentIndex === 0 && index === lastIndex) {
        // make the last slide the slide before the first
        // if it is RTL the base line should be reversed
        translateX = -100 * (isRTL ? -1 : 1) + offsetPercentage
      } else if (currentIndex === lastIndex && index === 0) {
        // make the first slide the slide after the last
        // if it is RTL the base line should be reversed
        translateX = 100 * (isRTL ? -1 : 1) + offsetPercentage
      }
    }

    // Special case when there are only 2 items with continuous on
    if (continuous && lastIndex === 1) {
      translateX = getTranslateXForTwoSlide(index)
    }

    let translate = `translate(${translateX}%, 0)`

    if (useTranslate3D) {
      translate = `translate3d(${translateX}%, 0, 0)`
    }

    return {
      WebkitTransform: translate,
      MozTransform: translate,
      msTransform: translate,
      OTransform: translate,
      transform: translate,
    }
  }

  const inTheMiddle = index => {
    if (continuous) {
      // don't add slides in middle when on ends to avoid overlay transitions
      const endIndex = items.length - 1
      const atEnd = currentIndex === endIndex
      const atStart = currentIndex === 0
      return (
        ((atStart && index > 1) || (atEnd && index < endIndex - 1)) &&
        ((index !== 0 && index !== endIndex) ||
          (index === endIndex &&
            currentIndex === 1 &&
            currentIndex !== endIndex))
      )
    }
    return false
  }

  return (
    <Wrapper
      swipeable={swipeable && lastIndex >= 1}
      flickThreshold={flickThreshold}
      preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
      onSwipedLeft={onSwipedLeft}
      onSwipedRight={onSwipedRight}
    >
      {items &&
        items.map((item, index) => {
          if (inTheMiddle(index)) return null

          const originalClass = item.originalClass
            ? ` ${item.originalClass}`
            : ''
          const renderer = item.renderItem || renderItem || getGalleryImage
          const alignment = getAlignmentClassName(index)
          const showItem = !lazyLoad || alignment
          const ItemRenderItem = showItem ? (
            renderer(item)
          ) : (
            <div style={{height: '100%'}} />
          )
          const slideStyle = getSlideStyle(index)

          return (
            <Slide
              key={index}
              index={index}
              slideStyle={Object.assign(slideStyle, transitionStyle)}
              item={item}
              className={`component-carousel__slide${alignment}${originalClass}`}
              onMouseOver={onMouseOver}
              onFocus={onFocus}
              onMouseLeave={onMouseLeave}
              onSlideClick={onSlideClick}
              onSlideTransitionEnd={handleSlideTransitionEnd}
            >
              {ItemRenderItem}
            </Slide>
          )
        })}
    </Wrapper>
  )
}

Slides.propTypes = {
  items: PropTypes.array.isRequired,
  currentIndex: PropTypes.number,
  previousIndex: PropTypes.number,
  isRTL: PropTypes.bool,
  lazyLoad: PropTypes.bool,
  continuous: PropTypes.bool,
  offsetPercentage: PropTypes.number,
  renderItem: PropTypes.func,
  defaultImage: PropTypes.string,
  transitionStyle: PropTypes.object,
  onSlideClick: PropTypes.func,
  onTransitionEnd: PropTypes.func,
  onImageError: PropTypes.func,
  onImageLoad: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseOver: PropTypes.func,
  onFocus: PropTypes.func,
  useTranslate3D: PropTypes.bool,
  swipeable: PropTypes.bool,
  flickThreshold: PropTypes.number,
  preventDefaultTouchmoveEvent: PropTypes.bool,
  onSwipedLeft: PropTypes.func,
  onSwipedRight: PropTypes.func,
}

export default Slides
