import { useRef, useEffect, useMemo } from 'react'
import gsap from 'gsap'


class FireParticle {
  constructor(canvas, color) {
    this.canvas = canvas
    this.color = color
    this.reset()
  }
  reset() {
    const w = this.canvas.width, h = this.canvas.height
    const edge = Math.floor(Math.random() * 4)
    if (edge === 0) { this.x = Math.random() * w; this.y = h + 10 }
    else if (edge === 1) { this.x = Math.random() * w; this.y = -10 }
    else if (edge === 2) { this.x = -10; this.y = Math.random() * h }
    else { this.x = w + 10; this.y = Math.random() * h }
    const cx = w / 2, cy = h / 2
    const angle = Math.atan2(cy - this.y, cx - this.x) + (Math.random() - 0.5) * 0.9
    const speed = 3 + Math.random() * 7
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed
    this.life = 0
    this.maxLife = 40 + Math.random() * 60
    this.size = 1.5 + Math.random() * 4
    this.trail = []
  }
  update() {
    this.trail.push({ x: this.x, y: this.y })
    if (this.trail.length > 14) this.trail.shift()
    this.x += this.vx + (Math.random() - 0.5) * 1.2
    this.y += this.vy + (Math.random() - 0.5) * 1.2
    this.vx *= 0.97; this.vy *= 0.97
    this.life++
    return this.life < this.maxLife
  }
  draw(ctx) {
    const progress = this.life / this.maxLife
    const alpha = Math.sin(progress * Math.PI)
    for (let i = 0; i < this.trail.length; i++) {
      const ta = (i / this.trail.length) * alpha * 0.5
      const ts = this.size * (i / this.trail.length)
      ctx.beginPath()
      ctx.arc(this.trail[i].x, this.trail[i].y, ts, 0, Math.PI * 2)
      ctx.fillStyle = this.color.replace('1.0)', `${ta.toFixed(2)})`)
      ctx.fill()
    }
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = this.color.replace('1.0)', `${alpha.toFixed(2)})`)
    ctx.fill()
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4)
    grd.addColorStop(0, this.color.replace('1.0)', `${(alpha * 0.6).toFixed(2)})`))
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2)
    ctx.fillStyle = grd
    ctx.fill()
  }
}


function useFireCanvas(canvasRef, active, colors) {
  const particles = useRef([])
  const frame = useRef(null)
  const lastSpawn = useRef(0)

  useEffect(() => {
    if (!active || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const loop = (ts) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'lighter'
      if (ts - lastSpawn.current > 16) {
        lastSpawn.current = ts
        const col = colors[Math.floor(Math.random() * colors.length)]
        particles.current.push(new FireParticle(canvas, col))
        if (particles.current.length < 140) particles.current.push(new FireParticle(canvas, col))
      }
      particles.current = particles.current.filter((p) => {
        const alive = p.update(); if (alive) p.draw(ctx); return alive
      })
      ctx.globalCompositeOperation = 'source-over'
      frame.current = requestAnimationFrame(loop)
    }
    frame.current = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(frame.current); window.removeEventListener('resize', resize) }
  }, [active, colors, canvasRef])
}


function LightStreaks({ reverse = false }) {
  const streaks = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      top: `${5 + Math.random() * 90}%`,
      width: `${20 + Math.random() * 60}%`,
      delay: `${i * 0.035}s`,
      hue: [200, 260, 330, 50, 140][i % 5],
      dir: reverse ? 'rtl' : 'ltr',
    }))
    , [reverse])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {streaks.map((s) => (
        <div
          key={s.id}
          className="light-streak"
          style={{
            top: s.top, width: s.width,
            left: s.dir === 'ltr' ? '-100%' : 'auto',
            right: s.dir === 'rtl' ? '-100%' : 'auto',
            animationDelay: s.delay,
            background: `linear-gradient(${s.dir === 'ltr' ? '90deg' : '270deg'}, transparent, hsl(${s.hue},100%,70%), transparent)`,
            animationName: s.dir === 'ltr' ? 'streakLTR' : 'streakRTL',
          }}
        />
      ))}
    </div>
  )
}


export function ForwardTransition({ onComplete }) {
  const wrap = useRef()
  const canvas = useRef()
  const colors = useMemo(() => [
    'rgba(0,191,255,1.0)', 'rgba(155,0,255,1.0)',
    'rgba(255,20,147,1.0)', 'rgba(255,255,255,1.0)', 'rgba(0,255,136,1.0)',
  ], [])

  useFireCanvas(canvas, true, colors)

  useEffect(() => {
    const el = wrap.current; if (!el) return
    const tl = gsap.timeline({ onComplete })
    tl
      .set(el, { opacity: 1, background: 'transparent' })
      .to(el, {
        keyframes: [
          { background: 'rgba(0,191,255,0.12)', duration: 0.06 },
          { background: 'rgba(155,0,255,0.18)', duration: 0.06 },
          { background: 'rgba(255,20,147,0.15)', duration: 0.06 },
          { background: 'rgba(0,191,255,0.25)', duration: 0.06 },
        ]
      })
      .to(el, { background: 'rgba(255,255,255,0.95)', duration: 0.12, ease: 'power4.in' }, 0.28)
      .to(el, { opacity: 0, duration: 0.5, ease: 'power3.out' }, 0.4)
    return () => tl.kill()
  }, [onComplete])

  return (
    <div ref={wrap} style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', opacity: 0 }}>
      <canvas ref={canvas} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'screen' }} />
      <LightStreaks />
    </div>
  )
}


export function BackwardTransition({ onComplete }) {
  const wrap = useRef()
  const canvas = useRef()
  const colors = useMemo(() => [
    'rgba(155,0,255,1.0)', 'rgba(255,20,147,1.0)', 'rgba(0,191,255,1.0)',
  ], [])

  useFireCanvas(canvas, true, colors)

  useEffect(() => {
    const el = wrap.current; if (!el) return
    const tl = gsap.timeline({ onComplete })
    tl
      .set(el, { opacity: 1 })
      .to(el, {
        keyframes: [
          { background: 'rgba(155,0,255,0.2)', x: -8, duration: 0.04 },
          { background: 'rgba(0,0,0,0)', x: 8, duration: 0.04 },
          { background: 'rgba(255,20,147,0.3)', x: -6, duration: 0.04 },
          { background: 'rgba(0,0,0,0)', x: 6, duration: 0.04 },
          { background: 'rgba(155,0,255,0.4)', x: -4, duration: 0.04 },
          { background: 'rgba(0,0,0,0)', x: 4, duration: 0.04 },
        ]
      })
      .to(el, { background: 'rgba(80,0,180,0.9)', x: 0, duration: 0.12, ease: 'power4.in' }, 0.28)
      .to(el, { opacity: 0, duration: 0.35, ease: 'power3.out' }, 0.4)
    return () => tl.kill()
  }, [onComplete])

  return (
    <div ref={wrap} style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', opacity: 0 }}>
      <canvas ref={canvas} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'screen' }} />
      <LightStreaks reverse />
    </div>
  )
}
