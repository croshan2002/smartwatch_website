import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import Watch from './Watch'
import { scene, ACCENT } from '../lib/store'

export default function Scene(props) {
  useEffect(() => {
    const onMove = (e) => {
      scene.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      scene.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div className="canvas-wrap" aria-hidden="true">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.3, 6.6], fov: 36 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} />
          <spotLight position={[3, 5, 6]} angle={0.45} penumbra={1} intensity={55} castShadow />
          <pointLight position={[-4, -2, 2]} intensity={8} color={ACCENT} />
          <Watch {...props} />
          <ContactShadows position={[0, -2.1, 0]} opacity={0.5} scale={12} blur={2.8} far={4} />
          <Environment resolution={256}>
            <Lightformer form="rect" intensity={4} position={[0, 4, -5]} scale={[10, 1.5, 1]} />
            <Lightformer form="rect" intensity={2.5} position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[6, 1, 1]} />
            <Lightformer form="rect" intensity={2.5} position={[5, 0, 1]} rotation-y={-Math.PI / 2} scale={[6, 1, 1]} />
            <Lightformer form="rect" intensity={1.5} position={[0, -3, 4]} rotation-x={-Math.PI / 3} scale={[8, 1, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  )
}
