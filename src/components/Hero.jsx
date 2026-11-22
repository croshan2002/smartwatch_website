import { motion } from 'motion/react'
import { scrollToId } from '../lib/smooth'

const ease = [0.22, 1, 0.36, 1]
const WORDS = ['Time,', 'reimagined.']

export default function Hero() {
  return (
    <section id="top" className="section hero" data-stage="hero">
      <div className="hero__copy">
        <motion.p
          className="kicker"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
        >
          PULSE Watch S · Titanium
        </motion.p>
        <h1 className="display">
          <span className="sr-only">PULSE Watch S titanium smartwatch: </span>
          {WORDS.map((w, i) => (
            <motion.span
              key={w}
              className="display__word"
              initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease, delay: 0.4 + i * 0.15 }}
            >
              {w}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="lead"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.85 }}
        >
          A titanium case, a screen you can read in Chennai sun, and a battery that lasts ten days. It
          knows your heart, your sleep and your pace, and stays out of your way.
        </motion.p>
        <motion.div
          className="row"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 1 }}
        >
          <motion.button className="btn" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => scrollToId('buy')}>
            Buy · ₹44,900
          </motion.button>
          <button className="btn btn--ghost" onClick={() => scrollToId('day')}>
            See a day on it →
          </button>
        </motion.div>
      </div>

      <motion.ul
        className="hero__chips"
        initial="h"
        animate="s"
        variants={{ s: { transition: { staggerChildren: 0.1, delayChildren: 1.2 } } }}
      >
        {['10-day battery', '3,000 nits', 'Dual-band GPS'].map((c) => (
          <motion.li key={c} variants={{ h: { opacity: 0, x: 20 }, s: { opacity: 1, x: 0 } }}>
            {c}
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}
