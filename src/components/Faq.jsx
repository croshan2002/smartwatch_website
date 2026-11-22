import { motion } from 'motion/react'
import { FAQ } from '../content/site'

export default function Faq() {
  return (
    <section id="faq" className="section faq" data-stage="buy" aria-labelledby="faq-title">
      <motion.div
        className="faq__col"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="kicker">FAQ</p>
        <h2 id="faq-title" className="h2">Questions, answered.</h2>
        <div className="faq__list">
          {FAQ.map((f, i) => (
            <details key={f.q} className="faq__item" open={i === 0}>
              <summary>
                <h3>{f.q}</h3>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
