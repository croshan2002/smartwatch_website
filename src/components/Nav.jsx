import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { scrollToId } from '../lib/smooth'

const LINKS = [
  ['day', 'Your day'],
  ['features', 'Features'],
  ['studio', 'Studio'],
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 30)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <motion.header
      className={`nav ${solid ? 'nav--solid' : ''}`}
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      <button className="logo" onClick={() => scrollToId('top')}>
        <span className="logo__mark" /> PULSE
      </button>
      <nav className="nav__links">
        {LINKS.map(([id, l]) => (
          <button key={id} onClick={() => scrollToId(id)}>
            {l}
          </button>
        ))}
      </nav>
      <button className="btn btn--sm" onClick={() => scrollToId('buy')}>
        Buy
      </button>
    </motion.header>
  )
}
