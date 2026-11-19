import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const SIZES = [
  { id: '41', label: '41 mm', price: 44900 },
  { id: '45', label: '45 mm', price: 49900 },
]
const inr = (n) => '₹' + n.toLocaleString('en-IN')

export default function Buy({ caseFinish, strap }) {
  const [size, setSize] = useState(SIZES[0])
  const [done, setDone] = useState(false)
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])

  const order = () => {
    setDone(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setDone(false), 2600)
  }

  return (
    <section id="buy" className="buy" data-stage="buy">
      <motion.div
        className="buy__card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="kicker">Your PULSE Watch S</p>
        <h2 className="h2">
          {caseFinish.name} with {strap.name}.
        </h2>
        <div className="buy__sizes">
          {SIZES.map((s) => (
            <button key={s.id} className={`sizebtn ${s.id === size.id ? 'on' : ''}`} onClick={() => setSize(s)}>
              <strong>{s.label}</strong>
              <span>{inr(s.price)}</span>
            </button>
          ))}
        </div>
        <motion.button className="btn btn--lg" whileTap={{ scale: 0.97 }} onClick={order}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={done ? 'done' : 'buy'}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {done ? '✓ Added to bag' : `Buy · ${inr(size.price)}`}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <p className="fine">Free delivery in 2 days · No-cost EMI from {inr(Math.round(size.price / 12))}/mo</p>
      </motion.div>

      <footer className="footer">
        <span>© {new Date().getFullYear()} PULSE. Concept product page.</span>
        <span>Vite · React Three Fiber · Motion · GSAP</span>
      </footer>
    </section>
  )
}
