import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ScrollTrigger } from '../lib/smooth'
import { scene } from '../lib/store'

const STEPS = [
  {
    time: '06:40',
    title: 'Morning run',
    text: 'Dual-band GPS locks in seconds. Pace, distance and heart rate on one glance.',
    face: 'run',
    note: { app: 'Workout', title: 'New 5K best', body: '25:20 · 18 s faster' },
  },
  {
    time: '10:00',
    title: 'Back-to-back calls',
    text: 'A tap on the wrist before each meeting. Reply with a quick message without touching the phone.',
    face: 'digital',
    note: { app: 'Calendar', title: 'Design review', body: 'Starts in 5 min · Room 4' },
  },
  {
    time: '15:20',
    title: 'Heart, always on',
    text: 'Continuous heart rate, ECG in 30 seconds and a nudge if anything looks off.',
    face: 'heart',
    note: { app: 'Health', title: 'Resting HR steady', body: '72 bpm · in your normal range' },
  },
  {
    time: '23:10',
    title: 'Sleep, measured',
    text: 'Deep, light and REM stages, plus a gentle haptic alarm that wakes only you.',
    face: 'sleep',
    note: { app: 'Sleep', title: 'Wind down', body: 'Bedtime in 20 min' },
  },
]

export default function Day() {
  const ref = useRef(null)
  const [step, setStep] = useState(-1)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const i = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))
        setStep(i)
      },
      onLeave: () => setStep(-1),
      onLeaveBack: () => setStep(-1),
    })
    return () => st.kill()
  }, [])

  // Push the active step to the watch screen.
  useEffect(() => {
    if (step < 0) return
    scene.face = STEPS[step].face
    scene.notification = null
    const t = setTimeout(() => {
      scene.notification = { title: STEPS[step].note.title, body: STEPS[step].note.body }
    }, 900)
    return () => clearTimeout(t)
  }, [step])

  const s = STEPS[Math.max(0, step)]

  return (
    <section id="day" ref={ref} className="day" data-stage="day">
      <div className="day__sticky">
        <div className="day__copy">
          <p className="kicker">A day on your wrist</p>
          <div className="day__time" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={s.time}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {s.time}
              </motion.span>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="h2">{s.title}</h2>
              <p className="lead">{s.text}</p>
            </motion.div>
          </AnimatePresence>

          <ol className="day__dots" aria-hidden="true">
            {STEPS.map((x, i) => (
              <li key={x.time} className={i === step ? 'on' : ''}>
                {i === step && <motion.span layoutId="day-dot" className="day__dot-fill" />}
              </li>
            ))}
          </ol>
        </div>

        {/* Notification card pops out next to the watch */}
        <div className="day__pop">
          <AnimatePresence mode="wait">
            {step >= 0 && (
              <motion.div
                key={step}
                className="notif"
                initial={{ opacity: 0, scale: 0.7, y: 20, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.9 }}
              >
                <span className="notif__app">{s.note.app}</span>
                <strong>{s.note.title}</strong>
                <span>{s.note.body}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
