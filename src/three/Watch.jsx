import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { easing } from 'maath'
import { drawFace, FACE_SIZE } from './faces'
import { scene, prefersReducedMotion, ACCENT } from '../lib/store'

/* ---------------- geometry helpers ---------------- */

function roundedRect(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

function flatPanel(w, h, r) {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 24)
  const p = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h)
  return g
}

const CASE_W = 1.6
const CASE_H = 1.92
const CASE_D = 0.3
const BEVEL = 0.07

function makeCase() {
  const g = new THREE.ExtrudeGeometry(roundedRect(CASE_W, CASE_H, 0.42), {
    depth: CASE_D,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 10,
    curveSegments: 24,
  })
  g.translate(0, 0, -CASE_D / 2)
  g.computeVertexNormals()
  return g
}

const STRAP_TOP = [
  [0, 0.78, -0.06],
  [0, 1.1, -0.1],
  [0, 1.4, -0.3],
  [0, 1.57, -0.7],
  [0, 1.57, -1.2],
  [0, 1.36, -1.72],
  [0, 0.96, -2.1],
  [0, 0.46, -2.3],
  [0, 0.1, -2.34],
]
const strapCurve = (sign) =>
  new THREE.CatmullRomCurve3(STRAP_TOP.map(([x, y, z]) => new THREE.Vector3(x, y * sign, z)))

// Sweeps a flat rectangular band along a curve (for sport + woven straps).
function sweepBand(curve, width, thick, segs = 120) {
  const X = new THREE.Vector3(1, 0, 0)
  const pos = []
  const uvs = []
  const idx = []
  const sides = [
    [1, 0], // outer  (+N)
    [-1, 0], // inner (-N)
    [0, 1], // right (+X)
    [0, -1], // left  (-X)
  ]
  const len = curve.getLength()
  sides.forEach(([n, x]) => {
    const base = pos.length / 3
    for (let i = 0; i <= segs; i++) {
      const t = i / segs
      const P = curve.getPointAt(t)
      const T = curve.getTangentAt(t)
      const N = new THREE.Vector3().crossVectors(T, X).normalize()
      for (let j = 0; j < 2; j++) {
        const a = j === 0 ? -1 : 1
        let v
        if (n !== 0) v = P.clone().addScaledVector(N, (n * thick) / 2).addScaledVector(X, (a * width) / 2 * n)
        else v = P.clone().addScaledVector(X, (x * width) / 2).addScaledVector(N, (a * thick) / 2 * x)
        pos.push(v.x, v.y, v.z)
        uvs.push(j, t * len * 2)
      }
    }
    for (let i = 0; i < segs; i++) {
      const a = base + i * 2
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  })
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

function linkMatrices(curve, spacing = 0.2) {
  const len = curve.getLength()
  const n = Math.floor(len / spacing)
  const X = new THREE.Vector3(1, 0, 0)
  const out = []
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n
    const P = curve.getPointAt(t)
    const T = curve.getTangentAt(t)
    const N = new THREE.Vector3().crossVectors(T, X).normalize()
    const m = new THREE.Matrix4().makeBasis(X, T, N).setPosition(P)
    out.push(m)
  }
  return out
}

function wovenTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 128, 128)
  for (let y = 0; y < 128; y += 8) {
    for (let x = 0; x < 128; x += 16) {
      const off = (y / 8) % 2 ? 8 : 0
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.fillRect((x + off) % 128, y, 8, 4)
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.fillRect((x + off + 8) % 128, y + 4, 8, 2)
    }
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(3, 3)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/* ---------------- poses ---------------- */

const POSES = {
  hero: { x: 1.45, y: 0, ry: -0.42, rx: 0.12, s: 0.95 },
  day: { x: 1.55, y: 0, ry: -0.2, rx: 0.06, s: 0.95 },
  features: { x: -1.75, y: 0, ry: 0.55, rx: 0.15, s: 0.9 },
  studio: { x: -1.5, y: 0, ry: 0.32, rx: 0.1, s: 0.98 },
  buy: { x: 0, y: 3.6, ry: 0.3, rx: 0.4, s: 0.7 },
}
const MOBILE_Y = { hero: 0.85, day: 0.85, features: 0.9, studio: 0.85, buy: 4 }

export default function Watch({ caseFinish, strap, strapColor }) {
  const root = useRef()
  const { viewport, size } = useThree()
  const mobile = size.width < 820

  const geo = useMemo(() => {
    const top = strapCurve(1)
    const bot = strapCurve(-1)
    return {
      case: makeCase(),
      screen: flatPanel(1.38, 1.64, 0.3),
      bezel: flatPanel(1.5, 1.76, 0.36),
      bandTop: sweepBand(top, 1.18, 0.1),
      bandBot: sweepBand(bot, 1.18, 0.1),
      links: [...linkMatrices(top), ...linkMatrices(bot)],
    }
  }, [])

  // Live screen texture
  const face = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = FACE_SIZE.W
    c.height = FACE_SIZE.H
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return { canvas: c, ctx: c.getContext('2d'), tex, mode: scene.face, t: 0, fade: 1, notifT: 0, lastNotif: null }
  }, [])

  const mats = useMemo(
    () => ({
      case: new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: 0.28, clearcoat: 0.4 }),
      bezel: new THREE.MeshBasicMaterial({ color: '#000' }),
      screen: new THREE.MeshBasicMaterial({ map: face.tex, toneMapped: false }),
      glass: new THREE.MeshPhysicalMaterial({ color: '#000', transparent: true, opacity: 0.12, roughness: 0.05, clearcoat: 1, metalness: 0.2 }),
      band: new THREE.MeshPhysicalMaterial({ roughness: 0.6, sheen: 0.6, sheenRoughness: 0.5, side: THREE.DoubleSide }),
      woven: new THREE.MeshStandardMaterial({ roughness: 0.95, map: wovenTexture(), side: THREE.DoubleSide }),
      link: new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.25 }),
      accent: new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false }),
      sensor: new THREE.MeshStandardMaterial({ color: '#0b0b0c', roughness: 0.2, metalness: 0.4 }),
    }),
    [face.tex]
  )

  const linkMesh = useRef()
  useEffect(() => {
    geo.links.forEach((m, i) => linkMesh.current.setMatrixAt(i, m))
    linkMesh.current.instanceMatrix.needsUpdate = true
  }, [geo])

  const tmp = useMemo(() => new THREE.Color(), [])

  useFrame((state, dt) => {
    /* --- screen --- */
    const f = face
    if (scene.face !== f.mode) {
      f.fade -= dt * 5
      if (f.fade <= 0) {
        f.mode = scene.face
        f.t = 0
        f.fade = 0
      }
    } else f.fade = Math.min(1, f.fade + dt * 4)
    f.t += dt
    if (scene.notification) {
      if (f.lastNotif !== scene.notification) {
        f.lastNotif = scene.notification
        f.notifT = 0
      }
      f.notifT = Math.min(1, f.notifT + dt * 2.2)
    } else f.notifT = Math.max(0, f.notifT - dt * 3)
    drawFace(f.ctx, f.mode, f.t, f.fade, f.lastNotif, f.notifT)
    f.tex.needsUpdate = true

    /* --- materials --- */
    easing.dampC(mats.case.color, tmp.set(caseFinish.hex), 0.3, dt)
    mats.case.metalness = caseFinish.metal
    mats.case.roughness = caseFinish.rough
    easing.dampC(mats.band.color, tmp.set(strapColor), 0.3, dt)
    easing.dampC(mats.woven.color, tmp.set(strapColor), 0.3, dt)
    easing.dampC(mats.link.color, tmp.set(strapColor), 0.3, dt)

    /* --- pose --- */
    const p = POSES[scene.stage] ?? POSES.hero
    const scale = p.s * (mobile ? Math.min(0.62, viewport.width / 3.6) : Math.max(0.75, Math.min(1, viewport.width / 9)))
    const x = mobile ? 0 : p.x * Math.min(1, viewport.width / 8.5)
    const y = mobile ? MOBILE_Y[scene.stage] : p.y
    const t = state.clock.elapsedTime
    const bob = prefersReducedMotion ? 0 : Math.sin(t * 0.7) * 0.05
    const sway = scene.stage === 'hero' && !prefersReducedMotion ? Math.sin(t * 0.3) * 0.18 : 0
    easing.damp3(root.current.position, [x, y + bob, 0], 0.5, dt)
    easing.damp3(root.current.scale, [scale, scale, scale], 0.45, dt)
    easing.dampE(
      root.current.rotation,
      [p.rx - scene.pointer.y * 0.1, p.ry + sway + scene.pointer.x * 0.22, 0],
      0.55,
      dt
    )
  })

  const kind = strap.kind

  return (
    <group ref={root}>
      {/* case */}
      <mesh geometry={geo.case} material={mats.case} castShadow />
      <mesh geometry={geo.bezel} material={mats.bezel} position={[0, 0, CASE_D / 2 + BEVEL + 0.001]} />
      <mesh geometry={geo.screen} material={mats.screen} position={[0, 0, CASE_D / 2 + BEVEL + 0.004]} />
      <mesh geometry={geo.bezel} material={mats.glass} position={[0, 0, CASE_D / 2 + BEVEL + 0.012]} />

      {/* digital crown + button */}
      <group position={[CASE_W / 2 + BEVEL + 0.05, 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh material={mats.case}>
          <cylinderGeometry args={[0.15, 0.15, 0.14, 40]} />
        </mesh>
        <mesh position={[0, -0.072, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.accent}>
          <torusGeometry args={[0.1, 0.018, 12, 40]} />
        </mesh>
      </group>
      <mesh position={[CASE_W / 2 + BEVEL + 0.01, -0.28, 0]} material={mats.case}>
        <boxGeometry args={[0.06, 0.42, 0.14]} />
      </mesh>

      {/* health sensor on the back */}
      <mesh position={[0, 0, -CASE_D / 2 - BEVEL - 0.02]} rotation={[Math.PI / 2, 0, 0]} material={mats.sensor}>
        <cylinderGeometry args={[0.5, 0.55, 0.06, 48]} />
      </mesh>

      {/* strap */}
      {kind === 'sport' && (
        <>
          <mesh geometry={geo.bandTop} material={mats.band} castShadow />
          <mesh geometry={geo.bandBot} material={mats.band} castShadow />
        </>
      )}
      {kind === 'woven' && (
        <>
          <mesh geometry={geo.bandTop} material={mats.woven} castShadow />
          <mesh geometry={geo.bandBot} material={mats.woven} castShadow />
        </>
      )}
      <instancedMesh ref={linkMesh} args={[null, null, geo.links.length]} material={mats.link} visible={kind === 'link'} castShadow>
        <boxGeometry args={[1.12, 0.17, 0.12]} />
      </instancedMesh>
    </group>
  )
}
