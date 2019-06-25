import React from 'react'

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

function BulletBar({ items, onClick, selectedIndex, disabled, ...props }) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  function handleIndexChange(index) {
    return (event) => {
      event.preventDefault()
      if (disabled) return
      if (typeof onClick === 'function') onClick(index)
    }
  }

  React.useEffect(() => {
    setCurrentIndex(selectedIndex)
  }, [selectedIndex])

  return <Wrapper>
    {items.map((item, index) => {
      const isActive = (currentIndex === index)
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
}

export default BulletBar
