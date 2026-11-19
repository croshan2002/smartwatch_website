// Draws the live watch face into a 2D canvas that is used as the screen texture.
import { ACCENT } from '../lib/store'

const W = 420
const H = 500
const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const MONO = '"JetBrains Mono", ui-monospace, Menlo, monospace'

export const FACE_SIZE = { W, H }

const pad = (n) => String(n).padStart(2, '0')

function ring(ctx, x, y, r, w, frac, color) {
  ctx.lineCap = 'round'
  ctx.lineWidth = w
  ctx.strokeStyle = color + '33'
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0.001, frac))
  ctx.stroke()
}

function analog(ctx, now) {
  const cx = W / 2
  const cy = H / 2
  // ticks
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2
    const major = i % 5 === 0
    const r1 = major ? 168 : 178
    ctx.strokeStyle = major ? '#ffffff' : '#ffffff55'
    ctx.lineWidth = major ? 5 : 2
    ctx.beginPath()
    ctx.moveTo(cx + Math.sin(a) * r1, cy - Math.cos(a) * r1)
    ctx.lineTo(cx + Math.sin(a) * 188, cy - Math.cos(a) * 188)
    ctx.stroke()
  }
  ctx.fillStyle = '#ffffffcc'
  ctx.font = `600 22px ${FONT}`
  ctx.textAlign = 'center'
  ctx.fillText('PULSE', cx, cy - 70)
  ctx.fillStyle = ACCENT
  ctx.font = `700 18px ${MONO}`
  ctx.fillText(now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }).toUpperCase(), cx, cy + 92)

  const s = now.getSeconds() + now.getMilliseconds() / 1000
  const m = now.getMinutes() + s / 60
  const h = (now.getHours() % 12) + m / 60
  const hand = (angle, len, width, color) => {
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(cx - Math.sin(angle) * 18, cy + Math.cos(angle) * 18)
    ctx.lineTo(cx + Math.sin(angle) * len, cy - Math.cos(angle) * len)
    ctx.stroke()
  }
  hand((h / 12) * Math.PI * 2, 100, 12, '#ffffff')
  hand((m / 60) * Math.PI * 2, 150, 8, '#ffffff')
  hand((s / 60) * Math.PI * 2, 165, 3, ACCENT)
  ctx.fillStyle = ACCENT
  ctx.beginPath()
  ctx.arc(cx, cy, 9, 0, Math.PI * 2)
  ctx.fill()
}

function digital(ctx, now) {
  ctx.textAlign = 'left'
  ctx.fillStyle = ACCENT
  ctx.font = `700 20px ${MONO}`
  ctx.fillText(now.toLocaleDateString('en-IN', { weekday: 'long' }).toUpperCase(), 40, 110)
  ctx.fillStyle = '#ffffff'
  ctx.font = `700 150px ${FONT}`
  ctx.fillText(pad(now.getHours()), 32, 250)
  ctx.fillText(pad(now.getMinutes()), 32, 390)
  ctx.fillStyle = '#ffffff77'
  ctx.font = `600 22px ${MONO}`
  ctx.fillText(`${pad(now.getSeconds())}s`, 300, 390)
  ctx.fillText('31°  ☀', 290, 250)
}

function activity(ctx, now, t) {
  const p = Math.min(1, t / 2) // fill-in on appear
  const cx = W / 2
  const cy = H / 2 - 20
  ring(ctx, cx, cy, 150, 30, 0.82 * p, '#ff3b6b')
  ring(ctx, cx, cy, 112, 30, 0.64 * p, '#b6ff3d')
  ring(ctx, cx, cy, 74, 30, 0.9 * p, '#3dd9ff')
  ctx.textAlign = 'center'
  ctx.fillStyle = '#fff'
  ctx.font = `700 26px ${MONO}`
  ctx.fillText(`${pad(now.getHours())}:${pad(now.getMinutes())}`, cx, cy + 10)
  ctx.font = `600 20px ${FONT}`
  ctx.fillStyle = '#ffffffaa'
  ctx.fillText(`${Math.round(486 * p)} kcal · ${Math.round(38 * p)} min · ${Math.round(10 * p)} h`, cx, H - 50)
}

function run(ctx, now, t) {
  ctx.textAlign = 'left'
  ctx.fillStyle = ACCENT
  ctx.font = `700 22px ${MONO}`
  ctx.fillText('● OUTDOOR RUN', 36, 92)
  const secs = Math.floor(t) + 1520
  ctx.fillStyle = '#fff'
  ctx.font = `700 78px ${MONO}`
  ctx.fillText(`${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`, 34, 190)
  const rows = [
    ['DIST', `${(5.12 + t * 0.003).toFixed(2)} km`],
    ['PACE', `5'08"`],
    ['BPM', `${148 + Math.round(Math.sin(t * 2) * 3)}`],
  ]
  rows.forEach(([k, v], i) => {
    const y = 270 + i * 70
    ctx.fillStyle = '#ffffff66'
    ctx.font = `600 20px ${MONO}`
    ctx.fillText(k, 38, y)
    ctx.fillStyle = '#fff'
    ctx.font = `700 46px ${FONT}`
    ctx.fillText(v, 140, y + 8)
  })
}

function heart(ctx, now, t) {
  ctx.textAlign = 'left'
  ctx.fillStyle = '#ff3b6b'
  ctx.font = `700 22px ${MONO}`
  ctx.fillText('♥ HEART RATE', 36, 92)
  const bpm = 72 + Math.round(Math.sin(t * 0.7) * 2)
  ctx.fillStyle = '#fff'
  ctx.font = `700 140px ${FONT}`
  ctx.fillText(String(bpm), 32, 240)
  ctx.font = `600 26px ${MONO}`
  ctx.fillStyle = '#ffffff88'
  ctx.fillText('BPM · resting', 40, 285)
  // ECG line
  ctx.strokeStyle = '#ff3b6b'
  ctx.lineWidth = 4
  ctx.lineJoin = 'round'
  ctx.beginPath()
  for (let x = 0; x <= W; x += 4) {
    const ph = (x / W) * 3 - t * 0.9
    const f = ph - Math.floor(ph)
    let y = 0
    if (f > 0.45 && f < 0.5) y = -70 * Math.sin(((f - 0.45) / 0.05) * Math.PI)
    else if (f > 0.5 && f < 0.55) y = 30 * Math.sin(((f - 0.5) / 0.05) * Math.PI)
    else if (f > 0.7 && f < 0.82) y = -12 * Math.sin(((f - 0.7) / 0.12) * Math.PI)
    x === 0 ? ctx.moveTo(x, 400 + y) : ctx.lineTo(x, 400 + y)
  }
  ctx.stroke()
}

function sleep(ctx) {
  ctx.textAlign = 'left'
  ctx.fillStyle = '#9b8cff'
  ctx.font = `700 22px ${MONO}`
  ctx.fillText('☾ SLEEP', 36, 92)
  ctx.fillStyle = '#fff'
  ctx.font = `700 96px ${FONT}`
  ctx.fillText('7h 42m', 32, 200)
  ctx.fillStyle = '#ffffff77'
  ctx.font = `600 22px ${MONO}`
  ctx.fillText('Deep 1h 51m · REM 1h 38m', 38, 245)
  const bars = [2, 3, 1, 3, 2, 4, 3, 2, 1, 3, 4, 2, 3, 2, 1, 2, 3, 2]
  bars.forEach((b, i) => {
    ctx.fillStyle = b === 4 ? '#9b8cff' : b === 3 ? '#6f62d8' : '#ffffff33'
    const x = 36 + i * 19
    ctx.beginPath()
    ctx.roundRect(x, 420 - b * 28, 13, b * 28, 5)
    ctx.fill()
  })
}

const DRAW = { analog, digital, activity, run, heart, sleep }

export function drawFace(ctx, mode, t, fade, notification, notifT) {
  const now = new Date()
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, W, H)
  ctx.save()
  ctx.globalAlpha = fade
  ;(DRAW[mode] ?? analog)(ctx, now, t)
  ctx.restore()

  if (notification && notifT > 0) {
    const k = Math.min(1, notifT)
    const e = 1 - Math.pow(1 - k, 3)
    const y = H - 20 - 150 * e
    ctx.save()
    ctx.globalAlpha = e
    ctx.fillStyle = '#1e1f24'
    ctx.beginPath()
    ctx.roundRect(18, y, W - 36, 130, 26)
    ctx.fill()
    ctx.fillStyle = ACCENT
    ctx.beginPath()
    ctx.arc(58, y + 44, 18, 0, Math.PI * 2)
    ctx.fill()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#fff'
    ctx.font = `700 24px ${FONT}`
    ctx.fillText(notification.title, 90, y + 52)
    ctx.fillStyle = '#ffffffaa'
    ctx.font = `500 21px ${FONT}`
    ctx.fillText(notification.body, 40, y + 100)
    ctx.restore()
  }
}
