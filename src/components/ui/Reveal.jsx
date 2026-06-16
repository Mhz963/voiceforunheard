import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

function isInViewport(el, offset = 80) {
  const rect = el.getBoundingClientRect()
  const viewHeight = window.innerHeight || document.documentElement.clientHeight
  return rect.top < viewHeight - offset && rect.bottom > 0
}

export default function Reveal({
  children,
  className = '',
  variant = 'up',
  delay = 0,
  as: Tag = 'div',
  ...props
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setVisible(false)
    const el = ref.current
    if (!el) return undefined

    let done = false

    const show = () => {
      if (done) return
      done = true
      setVisible(true)
    }

    const tryShow = () => {
      if (isInViewport(el, 40)) {
        show()
        return true
      }
      return false
    }

  // Respect reduced motion — show content immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show()
      return undefined
    }

    if (tryShow()) return undefined

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show()
          observer.disconnect()
        }
      },
      {
        threshold: isMobile ? [0, 0.05, 0.1] : [0, 0.1, 0.2],
        rootMargin: isMobile ? '0px 0px 12% 0px' : '0px 0px -40px 0px',
      },
    )

    observer.observe(el)

    const onScroll = () => {
      if (tryShow()) observer.disconnect()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    // Fallback for mobile browsers with delayed layout / IO quirks
    const timers = [100, 400, 800].map((ms) =>
      window.setTimeout(() => {
        if (tryShow()) observer.disconnect()
      }, ms),
    )

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      timers.forEach(clearTimeout)
    }
  }, [location.pathname])

  const variantClass =
    variant === 'left' ? 'reveal--left' :
    variant === 'right' ? 'reveal--right' :
    variant === 'scale' ? 'reveal--scale' : ''

  return (
    <Tag
      ref={ref}
      className={`reveal ${variantClass} ${visible ? 'reveal--visible' : ''} ${className}`.trim()}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  )
}
