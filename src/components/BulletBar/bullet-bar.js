import React from 'react'
import PropTypes from 'prop-types'

const Wrapper = ({children}) => {
  return (
    <div className="component-carousel__bullets">
      <div
        className="component-carousel__bullets-container"
        role="navigation"
        aria-label="Bullet Navigation"
      >
        {children}
      </div>
    </div>
  )
}

Wrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

function BulletBar({items, onClick, selectedIndex, disabled}) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  function handleIndexChange(index) {
    return event => {
      event.preventDefault()
      if (disabled) return
      if (typeof onClick === 'function') onClick(index)
    }
  }

  React.useEffect(() => {
    setCurrentIndex(selectedIndex)
  }, [selectedIndex])

  return (
    <Wrapper>
      {items.map((item, index) => {
        const isActive = currentIndex === index
        return (
          <button
            key={index}
            type="button"
            className={[
              'component-carousel__bullet',
              isActive ? 'active' : '',
              item.bulletClass || '',
            ].join(' ')}
            onClick={handleIndexChange(index)}
            aria-pressed={isActive ? 'true' : 'false'}
            aria-label={`Go to Slide ${index + 1}`}
          />
        )
      })}
    </Wrapper>
  )
}

BulletBar.propTypes = {
  items: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
}

export default BulletBar
