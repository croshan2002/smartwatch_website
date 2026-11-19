import { useEffect, useState } from 'react'
import Scene from './three/Scene'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Day from './components/Day'
import Features from './components/Features'
import Studio from './components/Studio'
import Buy from './components/Buy'
import { CASES, STRAPS, scene } from './lib/store'
import { initSmoothScroll, ScrollTrigger } from './lib/smooth'

export default function App() {
  const [caseFinish, setCase] = useState(CASES[0])
  const [strap, setStrap] = useState(STRAPS[0])
  const [strapColor, setStrapColor] = useState(STRAPS[0].colors[1])
  const [studioFace, setStudioFace] = useState('analog')

  useEffect(() => {
    const stop = initSmoothScroll()
    const triggers = [...document.querySelectorAll('[data-stage]')].map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (!self.isActive) return
          scene.stage = el.dataset.stage
          // Each stage shows its own face, except the day timeline which drives faces itself.
          if (scene.stage === 'hero') scene.face = 'analog'
          if (scene.stage === 'features') scene.face = 'activity'
          if (scene.stage === 'studio') scene.face = scene.studioFace
          if (scene.stage !== 'day') scene.notification = null
        },
      })
    )
    return () => {
      triggers.forEach((t) => t.kill())
      stop()
    }
  }, [])

  // Studio face choice applies while the studio is on screen.
  useEffect(() => {
    scene.studioFace = studioFace
    if (scene.stage === 'studio') scene.face = studioFace
  }, [studioFace])

  const chooseStrap = (s) => {
    setStrap(s)
    setStrapColor(s.colors[0])
  }

  return (
    <>
      <div className="spot" aria-hidden="true" />
      <Scene caseFinish={caseFinish} strap={strap} strapColor={strapColor} />
      <Nav />
      <main>
        <Hero />
        <Day />
        <Features />
        <Studio
          caseFinish={caseFinish}
          setCase={setCase}
          strap={strap}
          setStrap={chooseStrap}
          strapColor={strapColor}
          setStrapColor={setStrapColor}
          face={studioFace}
          setFace={setStudioFace}
        />
        <Buy caseFinish={caseFinish} strap={strap} />
      </main>
    </>
  )
}
