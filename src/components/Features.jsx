import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

const FEATURES = [
  { big: '10', unit: 'days', title: 'Battery', text: 'Ten days of normal use. 36 hours with GPS on.' },
  { big: '3,000', unit: 'nits', title: 'Display', text: 'LTPO OLED that stays readable at noon and dims to 1 nit at night.' },
  { big: '100', unit: 'm', title: 'Water rated', text: 'Swim, surf or dive to 40 m. Salt water is fine.' },
  { big: '2', unit: 'bands', title: 'Dual-band GPS', text: 'L1 + L5 for accurate tracks between tall buildings.' },
]

function TiltCard({ f, i }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 220, damping: 18 })
  const gx = useTransform(mx, [-0.5, 0.5], ['0%', '100%'])
  const gy = useTransform(my, [-0.5, 0.5], ['0%', '100%'])
  const glare = useTransform([gx, gy], ([x, y]) => `radial-gradient(240px circle at ${x} ${y}, rgba(77,255,195,0.18), transparent 60%)`)

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.li
      className="fcard"
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span className="fcard__glare" style={{ background: glare }} />
      <span className="fcard__big">
        {f.big}
        <small>{f.unit}</small>
      </span>
      <h3>{f.title}</h3>
      <p>{f.text}</p>
    </motion.li>
  )
}

export default function Features() {
  return (
    <section id="features" className="section features" data-stage="features">
      <div className="features__col">
        <p className="kicker">Features</p>
        <h2 className="h2">Small on the wrist. Big on everything else.</h2>
        <ul className="fgrid">
          {FEATURES.map((f, i) => (
            <TiltCard key={f.title} f={f} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
