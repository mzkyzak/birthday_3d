import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion'
import gsap from 'gsap'

function CharTypewriter({ text, delay = 0, speed = 15, style }) {
  const [displayedText, setDisplayedText] = useState('')
  const [inView, setInView] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
      } else {
        setInView(false)
        setDisplayedText('')
      }
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    let i = 0
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1))
        i++
        if (i >= text.length) clearInterval(interval)
      }, speed)
      return () => clearInterval(interval)
    }, delay * 1000)
    return () => clearTimeout(startTimer)
  }, [text, delay, speed, inView])

  return (
    <span ref={ref} style={{ display: 'inline', whiteSpace: 'pre-wrap', ...style }}>
      {displayedText}
      {inView && displayedText.length < text.length && (
        <span style={{ opacity: 0.8, color: '#00ffff', textShadow: '0 0 8px #00ffff' }}>_</span>
      )}
    </span>
  )
}

const AnimatedGradientText = ({ children, gradient, duration = 3, style }) => (
  <motion.div
    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
    transition={{ duration: duration, repeat: Infinity, ease: 'linear' }}
    style={{
      backgroundImage: gradient, backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      display: 'inline-block', ...style
    }}
  >
    {children}
  </motion.div>
)

function BrutalCanvasStars({ scrollYProgress }) {
  const canvasRef = useRef(null)
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.5, 0.1])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = window.innerWidth
    let height = window.innerHeight

    canvas.width = width
    canvas.height = height

    const numStars = 2000
    const stars = []
    const colors = ['#00ffff', '#0055ff', '#ff003c', '#ff0000']

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width * 2 - width, y: Math.random() * height * 2 - height,
        z: Math.random() * width, size: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 10 + 2
      })
    }

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(0, 0, width, height)
      const cx = width / 2; const cy = height / 2

      stars.forEach(star => {
        const prevZ = star.z
        star.z -= star.speed * 1.5

        if (star.z <= 0) {
          star.z = width
          star.x = Math.random() * width * 2 - width; star.y = Math.random() * height * 2 - height
        }

        const px = (star.x / star.z) * width + cx; const py = (star.y / star.z) * height + cy
        const prevPx = (star.x / prevZ) * width + cx; const prevPy = (star.y / prevZ) * height + cy
        const pSize = star.size * (width / star.z) * 1.5

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath(); ctx.moveTo(prevPx, prevPy); ctx.lineTo(px, py)
          ctx.lineWidth = pSize; ctx.strokeStyle = star.color; ctx.lineCap = 'round'; ctx.stroke()
        }
      })
      animationFrameId = requestAnimationFrame(render)
    }
    render()

    const handleResize = () => {
      width = window.innerWidth; height = window.innerHeight
      canvas.width = width; canvas.height = height
    }
    window.addEventListener('resize', handleResize)
    return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animationFrameId) }
  }, [])

  return (
    <motion.canvas ref={canvasRef} style={{ opacity, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, #000000 60%, #0a0005 85%, #1a0005 100%)' }} />
  )
}

function LivingWorldBackground({ scrollYProgress }) {
  const celestialY = useTransform(scrollYProgress, [0, 1], ['0vh', '-120vh'])
  const cloudsY = useTransform(scrollYProgress, [0, 0.5, 1], ['100vh', '0vh', '-60vh'])
  const earthY = useTransform(scrollYProgress, [0, 0.6, 1], ['100vh', '80vh', '0vh'])
  const atmosphereOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0.5, 1])

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 50, 40, 0.4) 50%, rgba(0, 20, 30, 0.9) 100%)', opacity: atmosphereOpacity }} />

      <motion.div style={{ position: 'absolute', inset: 0, y: celestialY }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '10%', right: '10%', width: '150px', height: '150px', borderRadius: '50%', background: 'linear-gradient(45deg, #ff0000, #ff003c)', boxShadow: '0 0 100px #ff0000, inset 0 0 30px #ffaaaa' }} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '5%', right: '5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(255,0,60,0.2) 0%, transparent 70%)', filter: 'blur(60px)', borderRadius: '50%' }} />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '25%', left: '15%', width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #0055ff, #000022)', boxShadow: '0 0 60px #00ffff, inset -15px -15px 30px rgba(0,0,0,0.8)' }}>
          <div style={{ position: 'absolute', top: '20%', left: '30%', width: '20px', height: '20px', background: 'rgba(0,0,0,0.4)', borderRadius: '50%', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', bottom: '30%', right: '20%', width: '30px', height: '30px', background: 'rgba(0,0,0,0.3)', borderRadius: '50%', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)' }} />
        </motion.div>
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '15%', left: '5%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(0,255,255,0.15) 0%, transparent 70%)', filter: 'blur(50px)', borderRadius: '50%' }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', inset: 0, y: cloudsY }}>
        <motion.div animate={{ x: ['100vw', '-50vw'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '30%', width: '60vw', height: '15vh', background: 'radial-gradient(ellipse, rgba(0,255,255,0.15) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        <motion.div animate={{ x: ['-50vw', '100vw'] }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '50%', width: '70vw', height: '20vh', background: 'radial-gradient(ellipse, rgba(255,0,60,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', bottom: 0, left: 0, width: '100vw', height: '50vh', y: earthY }}>
        <motion.div animate={{ backgroundPositionX: ['0px', '-1000px'] }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', bottom: '15vh', left: 0, width: '100vw', height: '30vh', backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><rect x="10" y="40" width="20" height="60" fill="%23050a10"/><rect x="40" y="20" width="30" height="80" fill="%23050a10"/><rect x="80" y="50" width="25" height="50" fill="%23050a10"/><rect x="120" y="10" width="40" height="90" fill="%23050a10"/><rect x="170" y="60" width="20" height="40" fill="%23050a10"/></svg>')`, backgroundSize: 'auto 100%', backgroundRepeat: 'repeat-x', opacity: 0.8 }} />
        <motion.div animate={{ backgroundPositionX: ['0px', '-1000px'] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', bottom: '15vh', left: 0, width: '100vw', height: '20vh', backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><polygon points="0,100 0,60 20,40 40,60 40,100" fill="%2300150a"/><polygon points="50,100 50,70 70,50 90,70 90,100" fill="%2300150a"/><rect x="110" y="40" width="40" height="60" fill="%2300150a"/><polygon points="160,100 160,80 180,60 200,80 200,100" fill="%2300150a"/></svg>')`, backgroundSize: 'auto 100%', backgroundRepeat: 'repeat-x', filter: 'drop-shadow(0 -5px 15px rgba(0,255,255,0.15))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100vw', height: '15vh', background: 'linear-gradient(to bottom, #002211, #000000)', borderTop: '3px solid #00ffff', boxShadow: '0 -15px 40px rgba(0,255,255,0.3), inset 0 20px 50px rgba(0,0,0,0.8)' }} />
      </motion.div>
    </div>
  )
}

function Box3D({ children, style, delay = 0, className = '', baseRotX = 6, baseRotY = -6, baseRotZ = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 100, rotateX: 30, rotateY: -20, rotateZ: 5, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotateX: baseRotX, rotateY: baseRotY, rotateZ: baseRotZ, scale: 1 }}
      whileHover={{ rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.02, y: -5, transition: { duration: 0.3 } }}
      viewport={{ once: false, margin: "0px" }}
      transition={{ type: "spring", stiffness: 70, damping: 18, delay }}
      style={{
        perspective: 1200, width: '100%', zIndex: 10, height: '100%',
        transformStyle: 'preserve-3d',
        boxShadow: '-6px 8px 0px rgba(0, 255, 255, 0.2), -12px 16px 0px rgba(255, 0, 60, 0.1)',
        background: 'linear-gradient(145deg, rgba(10, 15, 25, 0.85), rgba(5, 0, 10, 0.95))',
        backdropFilter: 'blur(20px)',
        borderTop: '2px solid rgba(0, 255, 255, 0.4)',
        borderRight: '2px solid rgba(255, 0, 60, 0.4)',
        borderRadius: '16px',
        padding: 'clamp(20px, 3vw, 30px)',
        boxSizing: 'border-box', ...style
      }}
    >
      <div style={{ position: 'relative', zIndex: 2, transform: 'translateZ(30px)', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
        {children}
      </div>
    </motion.div>
  )
}

export default function Scene5Conclusion({ onBack, onRestart }) {
  const nameRef = useRef()
  const badgeRef = useRef()
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 })
    tl.fromTo(nameRef.current,
      { opacity: 0, scale: 0.9, filter: 'blur(10px)', y: 20 },
      { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0, duration: 1.2, ease: 'power3.out' })
      .fromTo(badgeRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.6')
    return () => tl.kill()
  }, [])

  return (
    <div ref={scrollRef} style={{ background: 'transparent', height: '100vh', width: '100vw', overflowX: 'hidden', overflowY: 'auto', position: 'fixed', top: 0, left: 0, zIndex: 50, fontFamily: "'Courier New', Courier, monospace", color: '#e0e0e0', boxSizing: 'border-box' }}>

      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px; /* GAP LEBIH RAPAT */
          width: 100%;
        }
        @media (min-width: 900px) {
          .bento-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-template-areas:
              "welcome welcome mantras"
              "advice quote quote"
              "final final final";
          }
          .bento-welcome { grid-area: welcome; }
          .bento-mantras { grid-area: mantras; }
          .bento-advice { grid-area: advice; }
          .bento-quote { grid-area: quote; }
          .bento-final { grid-area: final; }
        }
      `}</style>

      <BrutalCanvasStars scrollYProgress={scrollYProgress} />
      <LivingWorldBackground scrollYProgress={scrollYProgress} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto', padding: '60px 20px 160px 20px', display: 'flex', flexDirection: 'column', gap: '35px', perspective: 1500, boxSizing: 'border-box' }}>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <AnimatedGradientText gradient="linear-gradient(90deg, #00ffff, #ff003c, #00ffff)" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', letterSpacing: '6px', fontWeight: 'bold', textShadow: '0 0 15px rgba(0,255,255,0.6)' }}>
            <CharTypewriter text="✨ HAPPY 18TH BIRTHDAY ✨" delay={0.1} speed={40} />
          </AnimatedGradientText>


          <h1 ref={nameRef} style={{ margin: '5px 0 0 0', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '900', letterSpacing: '1px', color: '#ffffff', textShadow: '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(255,0,60,0.8)' }}>
            Taufiq Ikhsan Muzaky
          </h1>


          <div ref={badgeRef} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '4px', background: 'rgba(0,0,0,0.6)', border: '1px solid #00ffff', fontSize: '0.9rem', backdropFilter: 'blur(5px)', boxShadow: '0 0 20px rgba(0,255,255,0.3)' }}>
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: '8px', height: '8px', background: '#ff003c', boxShadow: '0 0 10px #ff003c' }} />
            <span style={{ color: '#ff003c', fontWeight: 'bold' }}>@</span>
            <span style={{ letterSpacing: '1px', fontWeight: 'bold', color: '#00ffff' }}>mzkyzak</span>
          </div>
        </div>

        <div className="bento-grid">

          <Box3D className="bento-welcome" delay={0.1} baseRotX={5} baseRotY={8} baseRotZ={-1}>
            <AnimatedGradientText gradient="linear-gradient(90deg, #00ffff, #ff003c, #00ffff)" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 'bold', marginBottom: '15px', marginTop: 0, textShadow: '0 0 10px rgba(0,255,255,0.5)' }}>
              <CharTypewriter text="Selamat datang di usia ke-18." delay={0.2} speed={30} />
            </AnimatedGradientText>


            <div style={{ color: '#00ffff', lineHeight: '1.6', fontSize: 'clamp(0.9rem, 1.2vw, 1rem)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ margin: 0 }}><CharTypewriter text="gw bersyukur memiliki kepribadian yang baik maupun terus bersemangat mengikuti kegiatan belajar dengan sungguh-sungguh." delay={0.5} /></p>
              <p style={{ margin: 0, color: '#ff003c' }}><CharTypewriter text="Proses panjang dan konsisten tersebut telah mengantarkan saya hingga mampu memahami pemrograman Rekayasa Perangkat Lunak." delay={1.2} /></p>
              <p style={{ margin: 0 }}><CharTypewriter text="Hingga akhirnya, semua ilmu itu terwujud menjadi karya nyata: membuat dan membangun website serta aplikasi ini secara mandiri." delay={2.0} /></p>
            </div>
          </Box3D>

          <Box3D className="bento-mantras" delay={0.3} baseRotX={8} baseRotY={-6} baseRotZ={1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', fontWeight: 'bold' }}>
              <div style={{ color: '#00ffff', textShadow: '0 0 10px rgba(0,255,255,0.6)' }}>
                <CharTypewriter text="✦ Teruslah berkembang aplikasi_website." delay={0.2} />
              </div>
              <div style={{ color: '#ff003c', textShadow: '0 0 10px rgba(255,0,60,0.6)' }}>
                <CharTypewriter text="✦ Teruslah masa depan ku hehehe." delay={0.6} />
              </div>
              <div style={{ color: '#00ffff', textShadow: '0 0 10px rgba(0,255,255,0.6)' }}>
                <CharTypewriter text="✦ Tersuslah menciptakan masa proyek ku." delay={1.0} />
              </div>
            </div>
          </Box3D>

          <Box3D className="bento-advice" delay={0.4} baseRotX={-5} baseRotY={6} baseRotZ={-1}>
            <div style={{ color: '#ff003c', lineHeight: '1.6', fontSize: 'clamp(0.9rem, 1.2vw, 1rem)', display: 'flex', flexDirection: 'column', gap: '12px', fontWeight: 'bold' }}>
              <p style={{ margin: 0 }}><CharTypewriter text="• Jangan takut memulai sesuatu yang baru." delay={0.2} /></p>
              <p style={{ margin: 0 }}><CharTypewriter text="• Jangan ragu untuk masa masa yang akan mendatang." delay={0.6} /></p>
              <p style={{ margin: 0 }}><CharTypewriter text="• Dan jangan pernah berhenti belajar." delay={1.0} /></p>

              <div style={{ marginTop: '5px', color: '#00ffff', textShadow: '0 0 10px rgba(0,255,255,0.5)' }}>
                <CharTypewriter text="Karena setiap karya yang diciptakan hari ini dapat menjadi inspirasi di masa depan." delay={1.5} />
              </div>
            </div>
          </Box3D>

          <Box3D className="bento-quote" delay={0.5} baseRotX={-6} baseRotY={-8} baseRotZ={1} style={{ textAlign: 'center', boxShadow: '0 10px 30px rgba(255,0,60,0.3)' }}>
            <AnimatedGradientText gradient="linear-gradient(90deg, #ff003c, #00ffff, #ff003c)" duration={4} style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 'bold', margin: '0 0 10px 0', textShadow: '0 0 20px rgba(255,0,60,0.5)' }}>
              <CharTypewriter text='"The Best Is Yet To Come."' delay={0.2} />
            </AnimatedGradientText>
            <p style={{ margin: 0, color: '#aaaaaa', fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)', letterSpacing: '2px', fontWeight: 'bold' }}>
              — Taufiq Ikhsan Muzaky <span style={{ color: '#ff003c', textShadow: '0 0 10px #ff003c' }}>@mzkyzak</span>
            </p>
          </Box3D>

          <Box3D className="bento-final" delay={0.6} baseRotX={12} baseRotY={0} baseRotZ={0} style={{ borderLeft: '4px solid #00ffff', borderRight: '4px solid #ff003c' }}>
            <div style={{ color: '#00ffff', fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', letterSpacing: '4px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', textShadow: '0 0 15px rgba(0,255,255,0.8)' }}>
              <CharTypewriter text="Final Message" delay={0.2} />
            </div>

            <div style={{ color: '#00ffff', lineHeight: '1.6', fontSize: 'clamp(0.9rem, 1.2vw, 1rem)', display: 'flex', flexDirection: 'column', gap: '15px', fontWeight: 'bold' }}>
              <p style={{ margin: 0 }}><CharTypewriter text="Masih banyak pengalaman yang akan ditemui, tantangan yang harus dihadapi, terutama dalam dunia PKL, serta berbagai pencapaian yang menunggu untuk diraih." delay={0.5} /></p>
              <p style={{ margin: 0, color: '#ff003c' }}><CharTypewriter text="gue ingin terus berkembang dalam dunia rekayasa perangkat lunak, terbuka terhadap teknologi dan perubahan baru, serta berani mengambil langkah menuju tujuan yang lebih besar." delay={1.5} /></p>

              <div style={{ background: 'rgba(0,255,255,0.05)', padding: '15px 20px', borderRadius: '4px', borderLeft: '4px solid #00ffff', boxShadow: 'inset 0 0 20px rgba(0,255,255,0.2)' }}>
                <div style={{ color: '#00ffff', fontSize: 'clamp(1rem, 1.5vw, 1.15rem)' }}>
                  <CharTypewriter text="Teruslah membangun. Teruslah berkembangkan rekayasa perangkat lunak. Teruslah menciptakan sesuatu yang bermanfaat." delay={2.5} />
                </div>
              </div>

              <p style={{ margin: 0 }}><CharTypewriter text="Karena masa depan bukan untuk ditunggu, tetapi untuk dipersiapkan dan diwujudkan. PKL, ujian, dan perkuliahan 2027 adalah langkah berikutnya yang ingin gue capai." delay={3.5} /></p>

              <AnimatedGradientText gradient="linear-gradient(90deg, #00ffff, #ff003c, #00ffff)" duration={5} style={{ margin: '20px 0 0 0', fontWeight: 'bold', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', textShadow: '0 0 20px rgba(0,255,255,0.6)' }}>
                <CharTypewriter text="Happy 18th Birthday." delay={4.5} speed={40} />
              </AnimatedGradientText>

              <div style={{ marginTop: '5px', color: '#aaaaaa', fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)', fontWeight: 'bold' }}>
                <CharTypewriter text="Taufiq Ikhsan Muzaky" delay={5.0} /> <br />
                <span style={{ color: '#ff003c', textShadow: '0 0 10px rgba(0, 245, 245, 0.8)' }}>
                  <CharTypewriter text="@mzkyzak" delay={2.3} />
                </span>
              </div>
            </div>
          </Box3D>

        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ duration: 1.5, delay: 0.5 }} style={{ textAlign: 'center', color: '#555555', fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)', letterSpacing: '4px', marginTop: '20px', fontWeight: 'bold' }}>
          2026 © MZKYZAK
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: '20px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', background: 'linear-gradient(to top, rgba(0,0,0,1) 40%, transparent)', zIndex: 100, boxSizing: 'border-box' }}>
        {onBack && (
          <button onClick={onBack} style={{ padding: '12px 28px', borderRadius: '4px', background: 'rgba(0,0,0,0.8)', border: '1px solid #00ffff', color: '#00ffff', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '1px', transition: 'all 0.3s', boxShadow: '0 0 15px rgba(0,255,255,0.3)' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)' }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; e.currentTarget.style.transform = 'translateY(0)' }}>
            {'< KEMBALI'}
          </button>
        )}
        {onRestart && (
          <button onClick={onRestart} style={{ padding: '12px 28px', borderRadius: '4px', background: '#ff003c', border: '1px solid #ff003c', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '1px', transition: 'all 0.3s', boxShadow: '0 0 20px rgba(255,0,60,0.6)' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(255,0,60,0.8)' }} onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255,0,60,0.6)' }}>
            {'[ kembali menu awal ]'}
          </button>
        )}
      </motion.div>
    </div>
  )
}