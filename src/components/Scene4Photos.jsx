import { useRef, useMemo } from 'react'
import { motion, useAnimation } from 'framer-motion'
import gsap from 'gsap'
import { projects, memories } from '../data'


function CosmicBackground() {
  const createStars = (count, size, opacity) => {
    return Array.from({ length: count }).map(() =>
      `${Math.random() * 100}vw ${Math.random() * 100}vh 0 ${size}px rgba(0, 207, 255, ${Math.random() * opacity})`
    ).join(', ')
  }

  const layer1 = useMemo(() => createStars(150, 1, 0.4), [])
  const layer2 = useMemo(() => createStars(100, 1.5, 0.6), [])
  const layer3 = useMemo(() => createStars(50, 2, 0.9), [])
  const meteors = useMemo(() => Array.from({ length: 12 }), [])

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#020008', zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>

      <motion.div animate={{ scale: [1, 1.2, 1], x: ['-10vw', '10vw', '-10vw'], y: ['-10vh', '20vh', '-10vh'], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '0%', left: '10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(0,207,255,0.15) 0%, transparent 70%)', filter: 'blur(60px)', borderRadius: '50%' }} />
      <motion.div animate={{ scale: [1.2, 1, 1.2], x: ['10vw', '-10vw', '10vw'], y: ['20vh', '-10vh', '20vh'], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: '0%', right: '10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(155,0,255,0.15) 0%, transparent 70%)', filter: 'blur(80px)', borderRadius: '50%' }} />


      <motion.div animate={{ y: ['0vh', '-100vh'] }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }} style={{ width: '100%', height: '200%', position: 'absolute', top: 0, left: 0 }}>
        <div style={{ width: '1px', height: '1px', boxShadow: layer1 }} />
      </motion.div>
      <motion.div animate={{ y: ['0vh', '-100vh'] }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }} style={{ width: '100%', height: '200%', position: 'absolute', top: 0, left: 0 }}>
        <div style={{ width: '1px', height: '1px', boxShadow: layer2 }} />
      </motion.div>
      <motion.div animate={{ y: ['0vh', '-100vh'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} style={{ width: '100%', height: '200%', position: 'absolute', top: 0, left: 0 }}>
        <div style={{ width: '1px', height: '1px', boxShadow: layer3 }} />
      </motion.div>


      {meteors.map((_, i) => (
        <motion.div key={i} style={{ position: 'absolute', top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: `${100 + Math.random() * 150}px`, height: '2px', background: 'linear-gradient(90deg, rgba(255,255,255,1), transparent)', rotate: 45, transformOrigin: 'left', filter: 'drop-shadow(0 0 8px #00cfff)', opacity: 0 }} animate={{ x: ['0vw', '-60vw'], y: ['0vh', '60vh'], opacity: [0, 1, 0], scaleX: [0, 1, 0.5] }} transition={{ duration: 1 + Math.random() * 1.5, delay: Math.random() * 8, repeat: Infinity, ease: 'circIn' }} />
      ))}
    </div>
  )
}


const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 1 } }
}

const cardItemVariants = {
  hidden: { opacity: 0, rotateX: 60, y: 150, scale: 0.7, filter: 'blur(15px)' },
  show: { opacity: 1, rotateX: 0, y: 0, scale: 1, filter: 'blur(0px)', transition: { type: 'spring', damping: 18, stiffness: 80 } }
}


function ProjectCard({ project }) {
  const cardRef = useRef()
  const holoRef = useRef()

  const onMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(cardRef.current, {
      rotateY: x * 25, rotateX: -y * 25, z: 50, transformPerspective: 1200, duration: 0.4, ease: 'power3.out',
      boxShadow: `${-x * 30}px ${y * 30}px 40px rgba(0,0,0,0.5), 0 0 20px ${project.glow}40`
    })

    if (holoRef.current) {
      holoRef.current.style.opacity = 1
      holoRef.current.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, ${project.glow}80 0%, transparent 50%)`
    }
  }

  const onMouseLeave = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, z: 0, duration: 0.8, ease: 'elastic.out(1,0.4)', boxShadow: '0 0 0px rgba(0,0,0,0)' })
    if (holoRef.current) holoRef.current.style.opacity = 0
  }

  return (
    <motion.div variants={cardItemVariants} ref={cardRef} className="proj-card" style={{ '--card-color': project.color, '--card-glow': project.glow, padding: '24px', background: 'linear-gradient(145deg, rgba(20,20,35,0.6) 0%, rgba(10,10,15,0.8) 100%)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', position: 'relative', overflow: 'hidden' }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {/* Holographic Layer */}
      <div ref={holoRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s', mixBlendMode: 'screen' }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'inline-block' }}>
          <div className="proj-card-tag" style={{ color: project.color, fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px', textShadow: `0 0 10px ${project.glow}` }}>{project.tag}</div>
        </motion.div>
        <div className="proj-card-icon" style={{ fontSize: '2.2rem', marginBottom: '12px', filter: `drop-shadow(0 0 15px ${project.glow})` }}>{project.icon}</div>
        <div className="proj-card-title" style={{ fontSize: '1.3rem', fontWeight: 600, color: '#fff', letterSpacing: '1px' }}>{project.title}</div>
        <p className="proj-card-desc" style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>{project.desc}</p>
        <div className="proj-card-tech" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          {project.tech.map((t) => (
            <span key={t} className="proj-card-badge" style={{ fontSize: '0.7rem', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${project.glow}40`, borderRadius: '20px', color: '#fff', boxShadow: `inset 0 0 10px ${project.glow}20` }}>{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}


function PhotoCard({ photo }) {
  const cardRef = useRef()
  const imgRef = useRef()

  const onMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(cardRef.current, { rotateY: x * 30, rotateX: -y * 30, x: x * 15, y: y * 15, z: 40, transformPerspective: 1200, duration: 0.4, ease: 'power3.out', boxShadow: `${-x * 40}px ${y * 40}px 50px rgba(0,0,0,0.6), 0 0 30px ${photo.color}40` })
    gsap.to(imgRef.current, { scale: 1.15, x: -x * 20, y: -y * 20, duration: 0.4, ease: 'power2.out' })
  }

  const onMouseLeave = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, x: 0, y: 0, z: 0, duration: 0.8, ease: 'elastic.out(1,0.4)', boxShadow: '0 0 0px rgba(0,0,0,0)' })
    gsap.to(imgRef.current, { scale: 1, x: 0, y: 0, duration: 0.8, ease: 'power2.out' })
  }

  return (
    <motion.div variants={cardItemVariants}>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.div ref={cardRef} className="photo-mem-card" style={{ '--photo-color': photo.color, borderRadius: '18px', overflow: 'hidden', background: 'rgba(10,10,20,0.6)', backdropFilter: 'blur(10px)', border: `1px solid ${photo.color}40` }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} whileHover="hover">
          <div className="photo-mem-frame" style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
            <img ref={imgRef} src={photo.url} alt={photo.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1)' }} />
            <motion.div className="photo-mem-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent 60%)', display: 'flex', alignItems: 'flex-end', padding: '20px' }} variants={{ hover: { opacity: 1 } }} initial={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <span className="photo-mem-caption" style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.5px', textShadow: `0 0 10px ${photo.color}` }}>{photo.caption}</span>
            </motion.div>
          </div>
          <div className="photo-mem-label" style={{ padding: '16px 20px', fontSize: '0.8rem', letterSpacing: '2px', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.4)' }}>
            <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: '8px', height: '8px', background: photo.color, borderRadius: '50%', boxShadow: `0 0 12px ${photo.color}` }} />
            {photo.label}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function Scene4Photos({ onBack, onNext }) {
  return (
    <motion.div
      initial={{ clipPath: 'circle(0% at 50% 50%)', filter: 'brightness(4) contrast(2)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)', filter: 'brightness(1) contrast(1)' }}
      transition={{ duration: 1.8, ease: [0.8, 0, 0.1, 1] }}
      className="s4-root"
      style={{ position: 'fixed', inset: 0, display: 'flex', pointerEvents: 'auto' }}
    >
      <CosmicBackground />

      {/* Garis Pemisah Laser Menembak */}
      <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', background: 'rgba(255,255,255,0.05)', zIndex: 10 }}>
        <motion.div
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          style={{ width: '3px', height: '30%', background: 'linear-gradient(180deg, transparent, #00cfff, #9b00ff, transparent)', boxShadow: '0 0 20px #00cfff, 0 0 40px #9b00ff', marginLeft: '-1px', borderRadius: '50%' }}
        />
      </div>

      <div style={{ flex: 1, position: 'relative', zIndex: 5, overflowY: 'auto', overflowX: 'hidden' }}>
        <motion.div style={{ maxWidth: '580px', width: '100%', margin: '0 auto', padding: '80px 30px', paddingBottom: '160px' }} variants={gridContainerVariants} initial="hidden" animate="show">
          <motion.div variants={cardItemVariants} className="s4-panel-header" style={{ marginBottom: '50px' }}>
            <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: '0.7rem', letterSpacing: '5px', color: '#00cfff', display: 'block', marginBottom: '12px' }}>
              ✦ KARYA DIGITAL
            </motion.span>
            <motion.h2 animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ fontSize: 'clamp(2.8rem, 4vw, 4rem)', fontWeight: 800, color: '#fff', margin: '0 0 10px 0', textShadow: '0 0 30px rgba(0,207,255,0.4)' }}>
              Projects
            </motion.h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>Arsitektur kode & kontribusi oleh @mzkyzak</p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </motion.div>
      </div>

      <div style={{ flex: 1, position: 'relative', zIndex: 5, overflowY: 'auto', overflowX: 'hidden' }}>
        <motion.div style={{ maxWidth: '620px', width: '100%', margin: '0 auto', padding: '80px 30px', paddingBottom: '160px' }} variants={gridContainerVariants} initial="hidden" animate="show">
          <motion.div variants={cardItemVariants} className="s4-panel-header" style={{ marginBottom: '50px' }}>
            <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} style={{ fontSize: '0.7rem', letterSpacing: '5px', color: '#9b00ff', display: 'block', marginBottom: '12px' }}>
              ✦ REKAM JEJAK
            </motion.span>
            <motion.h2 animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }} style={{ fontSize: 'clamp(2.8rem, 4vw, 4rem)', fontWeight: 800, color: '#fff', margin: '0 0 10px 0', textShadow: '0 0 30px rgba(155,0,255,0.4)' }}>
              Memories
            </motion.h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>Momen yang membentuk perjalanan hingga hari ini</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '35px' }}>
            {memories.map((ph) => <PhotoCard key={ph.id} photo={ph} />)}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="scene-bottom-bar scene-bottom-bar--fixed"
        style={{ pointerEvents: 'none', zIndex: 100, background: 'linear-gradient(to top, rgba(2,0,8,0.98) 20%, transparent)', padding: '30px 50px' }}
      >
        {onBack && <button className="nav-btn" onClick={onBack} style={{ pointerEvents: 'auto', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>← Back</button>}
        {onNext && <button className="nav-btn nav-btn--primary" onClick={onNext} style={{ pointerEvents: 'auto', boxShadow: '0 0 25px rgba(0,207,255,0.4)' }}>Continue →</button>}
      </motion.div>

    </motion.div>
  )
}