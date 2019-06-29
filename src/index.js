import React from 'react'
import PropTypes from 'prop-types'

import './component-carousel.css'

import {usePrevious, useComponentSize} from './utils/hooks'
import SlideWrapper from './components/slide-wrapper'
import Slides from './components/Slides'
import ThumbnailBar from './components/ThumbnailBar'
import BulletBar from './components/BulletBar'
import {
  FullscreenButton,
  NavButton,
  PlayPauseButton,
} from './components/Buttons'
import SlideStatus from './components/SlideStatus'

const screenChangeEvents = [
  'fullscreenchange',
  'MSFullscreenChange',
  'mozfullscreenchange',
  'webkitfullscreenchange',
]
const NO_KEY = -1
const LEFT_ARROW = 37
const RIGHT_ARROW = 39
const ESC_KEY = 27
const LEFT = 'left'
const RIGHT = 'right'

// eslint-disable-next-line max-lines-per-function, max-statements, complexity
const ComponentCarousel = ({
  items = [],
  showNav = true,
  autoPlay = false,
  lazyLoad = false,
  continuous = true,
  showStatus = false,
  showBullets = false,
  showThumbnails = true,
  showPlayButton = true,
  showFullscreenButton = true,
  disableThumbnailScroll = false,
  disableArrowKeys = false,
  disableSwipe = false,
  useTranslate3D = true,
  isRTL = false,
  useBrowserFullscreen = true,
  preventDefaultTouchmoveEvent = false,
  slideOnThumbnailOver = false,
  flickThreshold = 0.4,
  indexSeparator = ' / ',
  thumbnailPosition = 'bottom',
  startIndex = 0,
  slideDuration = 900,
  slideInterval = 1000,
  renderLeftNav,
  renderRightNav,
  renderPlayPauseButton,
  renderFullscreenButton,
  onCarouselResize,
  onClick,
  onPause,
  onPlay,
  onSlide,
  onScreenChange,
  onImageLoad,
  onImageError,
  onThumbnailError,
  defaultImage,
  renderItem,
  renderThumbInner,
  onTouchMove,
  onTouchEnd,
  onTouchStart,
  onMouseOver,
  onFocus,
  onMouseLeave,
  onThumbnailClick,
  onCleanup,
  renderCustomControls,
  additionalClass,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(startIndex)
  const previousIndex = usePrevious(currentIndex)
  const [offsetPercentage, setOffsetPercentage] = React.useState(0)
  const [transitionStyle, setTransitionStyle] = React.useState({})
  const [isModalFullscreen, setIsModalFullscreen] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  // isSlidePlaying starts when index change, ends onTransitionEnd
  const [isSlidePlaying, setIsSlidePlaying] = React.useState(null)
  const [autoPlaying, setAutoPlaying] = React.useState(autoPlay)
  const [isTransitioning, setIsTransitioning] = React.useState(null)
  // Setup IntervalID for tracking auto next
  const [autoIntervalId, setAutoIntervalId] = React.useState(null)
  // classNames will hold the style names string
  const [classNames, setClassNames] = React.useState('')
  // slideWrapper holds slides inside as children
  const [slideWrapperSize, setSlideWrapperSize] = React.useState({
    height: 0,
    width: 0,
  })
  const [keyClicked, setKeyClicked] = React.useState(NO_KEY)
  /**
   * imageCarousel reference
   */
  const imageCarousel = React.useRef(null)
  const carouselSize = useComponentSize(imageCarousel)
  React.useEffect(() => {
    if (carouselSize && typeof onCarouselResize === 'function')
      onCarouselResize(carouselSize)
  }, [carouselSize])

  /**
   * Control functions
   */
  // Can we slide!
  const canSlidePrevious = () => currentIndex > 0
  const canSlideNext = () => currentIndex < items.length - 1
  const canSlideRight = () =>
    continuous || (isRTL ? canSlidePrevious() : canSlideNext())
  const canSlideLeft = () =>
    continuous || (isRTL ? canSlideNext() : canSlidePrevious())
  const canNavigate = () => items.length >= 2
  //Slide duration changed, update throttle duration
  const slideToIndex = index => {
    if (!isTransitioning) {
      const slideCount = items.length - 1
      const nextIndex = index < 0 ? slideCount : index > slideCount ? 0 : index

      setOffsetPercentage(0)
      setTransitionStyle({
        transition: `all ${slideDuration}ms ease-out`,
      })
      setCurrentIndex(nextIndex)
    }
  }
  const slideNext = event => slideToIndex(currentIndex + 1, event)

  const pauseAutoPlay = () => {
    if (autoPlay) setAutoPlaying(false)
    if (autoIntervalId) setAutoIntervalId(null)
  }

  const autoPlayNext = () => {
    setAutoIntervalId(
      window.setTimeout(() => {
        slideNext()
      }, slideInterval),
    )
  }

  const setModalFullscreen = state => {
    setIsModalFullscreen(state)
  }

  const exitFullScreen = () => {
    if (document && useBrowserFullscreen) {
      if (document.exitFullscreen && window.fullScreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else {
        // fallback to fullscreen modal for unsupported browsers
        setModalFullscreen(false)
      }
    } else {
      setModalFullscreen(false)
    }

    setIsFullscreen(false)
  }

  const handleFullScreen = () => {
    if (isFullscreen) {
      // Already in full screen, so exit
      exitFullScreen()
      return
    }
    const gallery = imageCarousel.current

    if (useBrowserFullscreen) {
      if (gallery.requestFullscreen) {
        gallery.requestFullscreen()
      } else if (gallery.msRequestFullscreen) {
        gallery.msRequestFullscreen()
      } else if (gallery.mozRequestFullScreen) {
        gallery.mozRequestFullScreen()
      } else if (gallery.webkitRequestFullscreen) {
        gallery.webkitRequestFullscreen()
      } else {
        // fallback to fullscreen modal for unsupported browsers
        setModalFullscreen(true)
      }
    } else {
      setModalFullscreen(true)
    }

    setIsFullscreen(true)
  }

  const handleScreenEvent = React.useCallback(() => {
    /**
     * handles screen change events that the browser triggers e.g. esc key
     */
    const fullScreenElement =
      document.fullscreenElement ||
      document.msFullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement

    setIsFullscreen(!!fullScreenElement)
  }, [])

  /**
   * Full Screen handlers
   */
  const handleScreenChange = React.useCallback(
    isFull => {
      if (typeof onScreenChange === 'function') onScreenChange(isFull)
    },
    [onScreenChange],
  )
  React.useEffect(() => {
    handleScreenChange(isFullscreen)
  }, [isFullscreen, handleScreenChange])

  const togglePlay = () => {
    setAutoPlaying(!autoPlaying)
  }

  const handleImageError = event => {
    if (defaultImage && event.target.src.indexOf(defaultImage) === -1) {
      event.target.src = defaultImage
    }
  }

  const handleIndexChange = index => {
    if (index === currentIndex) return

    pauseAutoPlay()
    slideToIndex(index)
    if (typeof onThumbnailClick === 'function') onThumbnailClick(index)
  }

  const slideLeft = () =>
    handleIndexChange(isRTL ? currentIndex + 1 : currentIndex - 1)
  const slideRight = () =>
    handleIndexChange(isRTL ? currentIndex - 1 : currentIndex + 1)

  /**
   * Tracking arrow keys (left, right)
   *  handleKeyDown creates a cached version so it does not renew on rerender
   */
  const handleKeyDown = React.useCallback(event => {
    const key = parseInt(event.which || event.keyCode || 0, 10)
    setKeyClicked(key)
  }, [])
  React.useEffect(() => {
    document.removeEventListener('keydown', handleKeyDown)
    if (!disableArrowKeys) {
      document.addEventListener('keydown', handleKeyDown)
    }
  }, [disableArrowKeys])
  React.useEffect(() => {
    switch (keyClicked) {
      case LEFT_ARROW:
        if (canSlideLeft() && !isSlidePlaying) {
          slideLeft()
        }
        break
      case RIGHT_ARROW:
        if (canSlideRight() && !isSlidePlaying) {
          slideRight()
        }
        break
      case ESC_KEY:
        if (isFullscreen && !useBrowserFullscreen) {
          exitFullScreen()
        }
        break
      default:
    }
  }, [keyClicked])

  React.useEffect(() => {
    screenChangeEvents.forEach(eventName => {
      document.addEventListener(eventName, handleScreenEvent)
    })
    return function cleanup() {
      screenChangeEvents.forEach(eventName => {
        document.removeEventListener(eventName, handleScreenEvent)
      })
    }
  }, [handleScreenEvent])

  React.useEffect(() => {
    const interval = autoIntervalId
    // Cleans up last interval if not null
    return function cleanup() {
      if (interval) window.clearInterval(interval)
    }
  }, [autoIntervalId])

  React.useEffect(() => {
    setIsSlidePlaying(false)
    setIsTransitioning(false)

    // Specify how to clean up after this effect:
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown)

      if (typeof onCleanup === 'function') onCleanup()
    }
  }, [handleKeyDown, onCleanup])

  /**
   * Current index changed, update views
   */
  React.useEffect(() => {
    const starting = previousIndex === undefined && currentIndex === startIndex
    if (autoPlaying && typeof onPlay === 'function') onPlay(currentIndex)
    setIsSlidePlaying(!starting)
    setIsTransitioning(!starting)
  }, [currentIndex])

  /**
   * Auto playing (true/false)
   */
  React.useEffect(() => {
    // External prop changed to auto play
    setAutoPlaying(autoPlay)
    if (autoPlay) autoPlayNext()
  }, [autoPlay])
  React.useEffect(() => {
    if (typeof onSlide === 'function')
      onSlide({index: currentIndex, isPlaying: isSlidePlaying})
  }, [isSlidePlaying])
  React.useEffect(() => {
    if (autoPlaying) slideNext() // Continue
    // Paused, because autoPlaying toggled off
    if (!autoPlaying && typeof onPause === 'function') onPause(currentIndex)
  }, [autoPlaying])
  React.useEffect(() => {
    if (!isTransitioning) {
      setIsSlidePlaying(false)
      setKeyClicked(NO_KEY)
      if (autoPlaying) autoPlayNext()
    }
  }, [isTransitioning])

  /**
   * Class Names
   */
  React.useEffect(() => {
    setClassNames(
      [
        'component-carousel',
        additionalClass,
        isModalFullscreen ? 'fullscreen-modal' : '',
      ]
        .filter(name => typeof name === 'string' && name !== '')
        .join(' '),
    )
  }, [additionalClass, isModalFullscreen])

  return (
    <div ref={imageCarousel} className={classNames} aria-live="polite">
      <div
        className={`component-carousel__content${
          isFullscreen ? ' fullscreen' : ''
        }`}
      >
        {showThumbnails &&
          (thumbnailPosition === 'top' || thumbnailPosition === 'left') && (
            <ThumbnailBar
              useTranslate3D={useTranslate3D}
              isRTL={isRTL}
              thumbnailPosition={thumbnailPosition}
              disableThumbnailScroll={disableThumbnailScroll}
              currentIndex={currentIndex}
              height={slideWrapperSize.height}
              items={items}
              renderThumbInner={renderThumbInner}
              onThumbClicked={handleIndexChange}
              slideOnThumbnailOver={slideOnThumbnailOver}
              onError={onThumbnailError || handleImageError}
              disabled={isSlidePlaying}
            />
          )}
        <SlideWrapper
          className={`component-carousel__slide-wrapper ${thumbnailPosition} ${
            isRTL ? 'right-to-left' : ''
          }`}
          onSizeChange={setSlideWrapperSize}
        >
          <Slides
            items={items}
            currentIndex={currentIndex}
            previousIndex={previousIndex}
            isRTL={isRTL}
            lazyLoad={lazyLoad}
            continuous={continuous}
            offsetPercentage={offsetPercentage}
            renderItem={renderItem}
            defaultImage={defaultImage}
            transitionStyle={transitionStyle}
            useTranslate3D={useTranslate3D}
            onMouseOver={onMouseOver}
            onFocus={onFocus}
            onMouseLeave={onMouseLeave}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchStart={onTouchStart}
            onSlideClick={onClick}
            onTransitionEnd={() => setIsTransitioning(false)}
            onImageError={onImageError}
            onImageLoad={onImageLoad}
            swipeable={!disableSwipe}
            flickThreshold={flickThreshold}
            preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
            onSwipedLeft={() => slideRight()}
            onSwipedRight={() => slideLeft()}
          />

          {renderCustomControls && renderCustomControls()}

          {showStatus && (
            <SlideStatus
              current={currentIndex + 1}
              separator={indexSeparator}
              total={items.length}
            />
          )}
          {showNav && canNavigate() && (
            <span key="navigation">
              <NavButton
                direction={`${LEFT}`}
                renderer={renderLeftNav}
                className={`component-carousel__${LEFT}-nav`}
                onClick={slideLeft}
                disabled={!canSlideLeft()}
              />

              <NavButton
                direction={`${RIGHT}`}
                renderer={renderRightNav}
                className={`component-carousel__${RIGHT}-nav`}
                onClick={slideRight}
                disabled={!canSlideRight()}
              />
            </span>
          )}
          {showPlayButton && (
            <PlayPauseButton
              renderer={renderPlayPauseButton}
              className={`component-carousel__play-button${
                autoPlaying ? ' active' : ''
              }`}
              onClick={togglePlay}
              active={autoPlaying}
            />
          )}
          {showBullets && (
            <BulletBar
              items={items}
              disabled={isSlidePlaying}
              onClick={handleIndexChange}
              selectedIndex={currentIndex}
            />
          )}
          {showFullscreenButton && (
            <FullscreenButton
              renderer={renderFullscreenButton}
              className={`component-carousel__fullscreen-button${
                isFullscreen ? ' active' : ''
              }`}
              onClick={handleFullScreen}
              active={isFullscreen}
            />
          )}
        </SlideWrapper>

        {showThumbnails &&
          (thumbnailPosition === 'bottom' || thumbnailPosition === 'right') && (
            <ThumbnailBar
              useTranslate3D={useTranslate3D}
              isRTL={isRTL}
              thumbnailPosition={thumbnailPosition}
              disableThumbnailScroll={disableThumbnailScroll}
              currentIndex={currentIndex}
              height={slideWrapperSize.height}
              items={items}
              renderThumbInner={renderThumbInner}
              onThumbClicked={handleIndexChange}
              slideOnThumbnailOver={slideOnThumbnailOver}
              onError={onImageError || handleImageError}
              disabled={isSlidePlaying}
            />
          )}
      </div>
    </div>
  )
}

ComponentCarousel.propTypes = {
  flickThreshold: PropTypes.number,
  items: PropTypes.array.isRequired,
  showNav: PropTypes.bool,
  autoPlay: PropTypes.bool,
  lazyLoad: PropTypes.bool,
  continuous: PropTypes.bool,
  showStatus: PropTypes.bool,
  showBullets: PropTypes.bool,
  showThumbnails: PropTypes.bool,
  showPlayButton: PropTypes.bool,
  showFullscreenButton: PropTypes.bool,
  disableThumbnailScroll: PropTypes.bool,
  disableArrowKeys: PropTypes.bool,
  disableSwipe: PropTypes.bool,
  useBrowserFullscreen: PropTypes.bool,
  preventDefaultTouchmoveEvent: PropTypes.bool,
  defaultImage: PropTypes.string,
  indexSeparator: PropTypes.string,
  thumbnailPosition: PropTypes.string,
  startIndex: PropTypes.number,
  slideDuration: PropTypes.number,
  slideInterval: PropTypes.number,
  slideOnThumbnailOver: PropTypes.bool,
  onCarouselResize: PropTypes.func,
  onSlide: PropTypes.func,
  onScreenChange: PropTypes.func,
  onPause: PropTypes.func,
  onPlay: PropTypes.func,
  onClick: PropTypes.func,
  onCleanup: PropTypes.func,
  onImageLoad: PropTypes.func,
  onImageError: PropTypes.func,
  onTouchMove: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onTouchStart: PropTypes.func,
  onMouseOver: PropTypes.func,
  onFocus: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onThumbnailError: PropTypes.func,
  onThumbnailClick: PropTypes.func,
  renderCustomControls: PropTypes.func,
  renderThumbInner: PropTypes.func,
  renderLeftNav: PropTypes.func,
  renderRightNav: PropTypes.func,
  renderPlayPauseButton: PropTypes.func,
  renderFullscreenButton: PropTypes.func,
  renderItem: PropTypes.func,
  additionalClass: PropTypes.string,
  useTranslate3D: PropTypes.bool,
  isRTL: PropTypes.bool,
}

export default ComponentCarousel
