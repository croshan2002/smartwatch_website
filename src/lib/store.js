// Mutable state read by the 3D scene every frame.
export const scene = {
  stage: 'hero', // hero | day | features | studio | buy
  face: 'analog', // analog | digital | activity | run | heart | sleep
  studioFace: 'analog',
  notification: null, // { title, body } drawn on the watch screen
  pointer: { x: 0, y: 0 },
}

export const CASES = [
  { id: 'titanium', name: 'Natural Titanium', hex: '#b8b4ad', metal: 1, rough: 0.28 },
  { id: 'midnight', name: 'Midnight', hex: '#23252b', metal: 0.85, rough: 0.35 },
  { id: 'gold', name: 'Champagne', hex: '#d8b98a', metal: 1, rough: 0.22 },
  { id: 'cobalt', name: 'Deep Cobalt', hex: '#2d3f6b', metal: 0.8, rough: 0.3 },
]

export const STRAPS = [
  { id: 'sport', name: 'Sport Band', kind: 'sport', colors: ['#e8e4dc', '#1c1d21', '#4dffc3', '#ff6b4a'] },
  { id: 'woven', name: 'Woven Loop', kind: 'woven', colors: ['#7d8aa8', '#c2a27c', '#5a6b55', '#a34b5a'] },
  { id: 'link', name: 'Link Bracelet', kind: 'link', colors: ['#c9c9c9', '#2a2a2e', '#d8b98a', '#9aa3b2'] },
]

export const FACES = [
  { id: 'analog', name: 'Meridian' },
  { id: 'digital', name: 'Mono' },
  { id: 'activity', name: 'Rings' },
]

export const ACCENT = '#4dffc3'

export const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
