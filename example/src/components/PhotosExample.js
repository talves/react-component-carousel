import React from 'react'
import ImageGallery from 'react-component-carousel'

let isDebug = false
const debug = (...messages) => {
  if (!isDebug) return
  console.debug(messages)
}

const PhotosExample = ({className}) => {
  const [showSettings, setShowSettings] = React.useState(false)
  const [autoPlay, setAutoPlay] = React.useState(false)
  const [lazyLoad, setLazyLoad] = React.useState(false)
  const [showStatus, setShowStatus] = React.useState(false)
  const [showBullets, setShowBullets] = React.useState(true)
  const [continuous, setInfinite] = React.useState(true)
  const [showThumbnails, setShowThumbnails] = React.useState(true)
  const [showFullscreenButton, setShowFullscreenButton] = React.useState(true)
  const [showGalleryFullscreenButton, setShowGalleryFullscreenButton] = React.useState(true)
  const [showPlayButton, setShowPlayButton] = React.useState(true)
  const [showGalleryPlayButton, setShowGalleryPlayButton] = React.useState(true)
  const [showNav, setShowNav] = React.useState(true)
  const [isRTL, setIsRTL] = React.useState(false)
  const [disableArrowKeys, setDisableArrowKeys] = React.useState(false)
  const [slideDuration, setSlideDuration] = React.useState(600)
  const [slideInterval, setSlideInterval] = React.useState(1200)
  const [slideOnThumbnailOver, setSlideOnThumbnailOver] = React.useState(false)
  const [thumbnailPosition, setThumbnailPosition] = React.useState('bottom')
  const [showVideo, setShowVideo] = React.useState({})

  const renderVideo = item => {
    return (
      <div className="image-gallery-image">
        {showVideo[item.embedUrl] ? (
          <div className="video-wrapper">
            <button className="close-video" onClick={toggleShowVideo.bind(this, item.embedUrl)} />
            <iframe
              title="Show Vid"
              width="560"
              height="315"
              src={item.embedUrl}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        ) : (
          <button onClick={toggleShowVideo.bind(this, item.embedUrl)}>
            <div className="play-button" />
            <img src={item.original} alt="This is an Item" />
            {item.description && (
              <span className="image-gallery-description" style={{ right: '0', left: 'initial' }}>
                {item.description}
              </span>
            )}
          </button>
        )}
      </div>
    )
  }

  const getStaticImages = () => {
    let images = []
    for (let i = 2; i < 20; i++) {
      images.push({
        original: `/images/placeimg_640_480_${i}.jpg`,
        thumbnail: `/images/placeimg_640_480_${i}.jpg`,
      })
    }

    return images
  }

  const images = getStaticImages().concat([
    {
      thumbnail: `/images/placeimg_640_480_${0}.jpg`,
      original: `/images/placeimg_640_480_${0}.jpg`,
      embedUrl: 'https://www.youtube.com/embed/4pSzhZ76GdM?autoplay=1&showinfo=0',
      description: 'Render custom slides within the gallery',
      renderItem: renderVideo,
    },
    {
      original: `/images/placeimg_640_480_${1}.jpg`,
      thumbnail: `/images/placeimg_640_480_${1}.jpg`,
      imageSet: [
        {
          srcSet: `/images/placeimg_640_480_${0}.jpg`,
          media: '(max-width: 640px)',
        },
        {
          srcSet: `/images/placeimg_640_480_${1}.jpg`,
          media: '(min-width: 640px)',
        },
      ],
    },
  ])

  const handleClick = event => {
    debug('Component Click', event)
  }

  const onImageClick = ({index}) => {
    debug('clicked on image index:', index)
  }

  const onImageLoad = event => {
    debug('loaded image', event.target.src)
  }

  const onSlide = ({index, isPlaying}) => {
    resetVideo()
    debug(`'${isPlaying ? 'sliding' : 'slid'} index:${index}`)
  }

  const onPause = index => {
    debug('paused on index', index)
  }

  const onTouchStart = event => {
    debug('onTouchStart:', event)
  }

  const onTouchEnd = event => {
    debug('onTouchEnd:', event)
  }

  const onTouchMove = event => {
    debug('onTouchMove:', event)
  }

  const onScreenChange = fullScreenElement => {
    debug('isFullScreen?', !!fullScreenElement)
  }

  const onPlay = index => {
    debug('playing from index', index)
  }

  const handleInputChange = (setStateCall, event) => {
    setStateCall(event.target.value)
  }

  const handleCheckboxChange = (setStateCall, event) => {
    setStateCall(event.target.checked)
  }

  const resetVideo = () => {
    setShowVideo({})

    if (showPlayButton) setShowGalleryPlayButton(true)

    if (showFullscreenButton) setShowGalleryFullscreenButton(true)
  }

  const toggleShowVideo = url => {
    showVideo[url] = !Boolean(showVideo[url])
    setShowVideo(showVideo)

    if (showVideo[url]) {
      if (showPlayButton) setShowGalleryPlayButton(false)

      if (showFullscreenButton) setShowGalleryFullscreenButton(false)
    }
  }

  React.useEffect(() => {
    // imageGallery.pause()
    // imageGallery.play()
  }, [slideInterval, slideDuration])

  return (
    <div className={className}>
      <ImageGallery
        items={images}
        disableArrowKeys={disableArrowKeys}
        lazyLoad={lazyLoad}
        autoPlay={autoPlay}
        onClick={handleClick}
        onImageClick={onImageClick}
        onImageLoad={onImageLoad}
        onSlide={onSlide}
        onPause={onPause}
        onScreenChange={onScreenChange}
        onPlay={onPlay}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchStart={onTouchStart}
        continuous={continuous}
        showBullets={showBullets}
        showFullscreenButton={showFullscreenButton && showGalleryFullscreenButton}
        showPlayButton={showPlayButton && showGalleryPlayButton}
        showThumbnails={showThumbnails}
        showStatus={showStatus}
        showNav={showNav}
        isRTL={isRTL}
        thumbnailPosition={thumbnailPosition}
        slideDuration={parseInt(slideDuration)}
        slideInterval={parseInt(slideInterval)}
        slideOnThumbnailOver={slideOnThumbnailOver}
        additionalClass="app-image-carousel"
      />

      <div className="app-sandbox">
        <div className="app-sandbox-content">
          <h2 className="app-header">Settings <input
          id="showSettings"
          type="checkbox"
          onChange={handleCheckboxChange.bind(this, setShowSettings)}
          checked={showSettings}
        /></h2>

          {showSettings && 
            <>
            <ul className="app-buttons">
            <li>
              <div className="app-interval-input-group">
                <span className="app-interval-label">Play Interval</span>
                <input
                  className="app-interval-input"
                  type="text"
                  onChange={handleInputChange.bind(this, setSlideInterval)}
                  value={slideInterval}
                />
              </div>
            </li>

            <li>
              <div className="app-interval-input-group">
                <span className="app-interval-label">Slide Duration</span>
                <input
                  className="app-interval-input"
                  type="text"
                  onChange={handleInputChange.bind(this, setSlideDuration)}
                  value={slideDuration}
                />
              </div>
            </li>

            <li>
              <div className="app-interval-input-group">
                <span className="app-interval-label">Thumbnail Bar Position</span>
                <select
                  className="app-interval-input"
                  value={thumbnailPosition}
                  onChange={handleInputChange.bind(this, setThumbnailPosition)}
                >
                  <option value="bottom">Bottom</option>
                  <option value="top">Top</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </li>
          </ul>

          <ul className="app-checkboxes">
            <li>
              <input
                id="debugg"
                type="checkbox"
                onChange={event => (isDebug = event.currentTarget.checked)}
              />
              <label htmlFor="debugg">debug</label>
            </li>

            <li>
              <input
                id="autoplay"
                type="checkbox"
                onChange={handleCheckboxChange.bind(this, setAutoPlay)}
                checked={autoPlay}
              />
              <label htmlFor="autoplay">auto play</label>
            </li>
            <li>
              <input
                id="lazyload"
                type="checkbox"
                onChange={handleCheckboxChange.bind(this, setLazyLoad)}
                checked={lazyLoad}
              />
              <label htmlFor="lazyload">lazy load</label>
            </li>
            <li>
              <input
                id="continuous"
                type="checkbox"
                onChange={handleCheckboxChange.bind(this, setInfinite)}
                checked={continuous}
              />
              <label htmlFor="continuous">allow continuous sliding</label>
            </li>
            <li>
              <input
                id="disableArrows"
                type="checkbox"
                onChange={handleCheckboxChange.bind(this, setDisableArrowKeys)}
                checked={disableArrowKeys}
              />
              <label htmlFor="disableArrows">disable arrow keys</label>
            </li>
            <li>
              <input
                id="show_fullscreen"
                type="checkbox"
                onChange={handleCheckboxChange.bind(this, setShowFullscreenButton)}
                checked={showFullscreenButton}
              />
              <label htmlFor="show_fullscreen">show fullscreen button</label>
            </li>
            <li>
              <input
                id="show_playbutton"
                type="checkbox"
                onChange={handleCheckboxChange.bind(this, setShowPlayButton)}
                checked={showPlayButton}
              />
              <label htmlFor="show_playbutton">show play button</label>
            </li>
            <li>
              <input
                id="show_bullets"
                type="checkbox"
                onChange={handleCheckboxChange.bind(this, setShowBullets)}
                checked={showBullets}
              />
              <label htmlFor="show_bullets">show bullets</label>
            </li>
            <li>
              <input
                id="show_thumbnails"
                type="checkbox"
                onChange={handleCheckboxChange.bind(this, setShowThumbnails)}
                checked={showThumbnails}
              />
              <label htmlFor="show_thumbnails">show thumbnails</label>
            </li>
            <li>
              <input
                id="show_navigation"
                type="checkbox"
                onChange={handleCheckboxChange.bind(this, setShowNav)}
                checked={showNav}
              />
              <label htmlFor="show_navigation">show navigation</label>
            </li>
            <li>
              <input
                id="show_index"
                type="checkbox"
                onChange={handleCheckboxChange.bind(this, setShowStatus)}
                checked={showStatus}
              />
              <label htmlFor="show_index">show index</label>
            </li>
            <li>
              <input
                id="is_rtl"
                type="checkbox"
                onChange={handleCheckboxChange.bind(this, setIsRTL)}
                checked={isRTL}
              />
              <label htmlFor="is_rtl">is right to left</label>
            </li>
            <li>
              <input
                id="slide_on_thumbnail_hover"
                type="checkbox"
                onChange={handleCheckboxChange.bind(this, setSlideOnThumbnailOver)}
                checked={slideOnThumbnailOver}
              />
              <label htmlFor="slide_on_thumbnail_hover">slide on mouse over thumbnails</label>
            </li>
          </ul>
          </>
          }
        </div>
      </div>
    </div>
  )
}

export default PhotosExample
