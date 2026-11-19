import { motion, AnimatePresence } from 'motion/react'
import { CASES, STRAPS, FACES } from '../lib/store'

const spring = { type: 'spring', stiffness: 450, damping: 34 }

function Segmented({ items, value, onChange, id, label }) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {items.map((it) => {
        const on = it.id === value
        return (
          <button key={it.id} role="radio" aria-checked={on} className={`seg__btn ${on ? 'on' : ''}`} onClick={() => onChange(it)}>
            {on && <motion.span layoutId={`${id}-pill`} className="seg__pill" transition={spring} />}
            <span>{it.name}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function Studio({ caseFinish, setCase, strap, setStrap, strapColor, setStrapColor, face, setFace }) {
  return (
    <section id="studio" className="section studio" data-stage="studio">
      <div className="studio__panel">
        <p className="kicker">Studio</p>
        <h2 className="h2">Make it yours.</h2>

        <div className="opt">
          <div className="opt__head">
            <span>Case</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.em key={caseFinish.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                {caseFinish.name}
              </motion.em>
            </AnimatePresence>
          </div>
          <div className="dots" role="radiogroup" aria-label="Case finish">
            {CASES.map((c) => (
              <button
                key={c.id}
                role="radio"
                aria-checked={c.id === caseFinish.id}
                aria-label={c.name}
                className="dotbtn"
                onClick={() => setCase(c)}
              >
                {c.id === caseFinish.id && <motion.span layoutId="case-ring" className="dotbtn__ring" transition={spring} />}
                <span className="dotbtn__fill" style={{ background: `radial-gradient(circle at 30% 30%, #fff8, ${c.hex} 55%)` }} />
              </button>
            ))}
          </div>
        </div>

        <div className="opt">
          <div className="opt__head">
            <span>Band</span>
          </div>
          <Segmented items={STRAPS} value={strap.id} onChange={setStrap} id="strap" label="Band style" />
          <div className="dots dots--sm" role="radiogroup" aria-label="Band colour">
            {strap.colors.map((c) => (
              <button
                key={c}
                role="radio"
                aria-checked={c === strapColor}
                aria-label={`Band colour ${c}`}
                className="dotbtn dotbtn--sm"
                onClick={() => setStrapColor(c)}
              >
                {c === strapColor && <motion.span layoutId="band-ring" className="dotbtn__ring" transition={spring} />}
                <span className="dotbtn__fill" style={{ background: c }} />
              </button>
            ))}
          </div>
        </div>

        <div className="opt">
          <div className="opt__head">
            <span>Face</span>
          </div>
          <Segmented items={FACES} value={face} onChange={(f) => setFace(f.id)} id="face" label="Watch face" />
        </div>
      </div>
    </section>
  )
}
