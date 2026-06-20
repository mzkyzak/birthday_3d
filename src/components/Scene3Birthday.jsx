import { useFrame, useThree } from '@react-three/fiber'
import { Html, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { profile } from '../data'

const CYAN = '#00cfff'
const PURPLE = '#9b00ff'

function FallingStars() {
  const ref = useRef()
  const COUNT = 150

  const { posArr, velArr } = useMemo(() => {
    const p = new Float32Array(COUNT * 3)
    const v = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      p[i * 3] = (Math.random() - 0.5) * 36
      p[i * 3 + 1] = 10 + Math.random() * 18
      p[i * 3 + 2] = (Math.random() - 0.5) * 18 - 5
      v[i] = 0.025 + Math.random() * 0.04
    }
    return { posArr: p, velArr: v }
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const arr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] -= velArr[i]
      if (arr[i * 3 + 1] < -14) {
        arr[i * 3 + 1] = 14 + Math.random() * 4
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={posArr} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color={CYAN} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  )
}

const FloatingOrb = memo(function FloatingOrb({ position, color, size, speed }) {
  const ref = useRef()
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * speed + offset) * 1.0
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.5 + offset) * 0.35
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial
        color={color} emissive={color} emissiveIntensity={1.2}
        transparent opacity={0.10} blending={THREE.AdditiveBlending}
        depthWrite={false} toneMapped={false}
      />
    </mesh>
  )
})

function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const camX = useRef(0)
  const camY = useRef(0)

  useEffect(() => {
    camera.position.set(0, 0, 14)
    const start = performance.now()
    const dur = 2600
    const tick = () => {
      const t = Math.min((performance.now() - start) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      camera.position.z = 14 + (8 - 14) * ease
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [camera])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const tx = mouse.current.x * 0.4 + Math.sin(t * 0.42) * 0.22
    const ty = mouse.current.y * 0.4 + Math.cos(t * 0.35) * 0.16
    camX.current += (tx - camX.current) * 0.035
    camY.current += (ty - camY.current) * 0.035
    camera.position.x = camX.current
    camera.position.y = camY.current
    camera.lookAt(0, 0, 0)
  })

  return null
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.7 } }
}
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
}

const ORB_CONFIGS = [
  { pos: [-6, 3, -4], color: CYAN, size: 0.38, speed: 0.38 },
  { pos: [5, -2, -3], color: PURPLE, size: 0.55, speed: 0.28 },
  { pos: [-4, -4, -5], color: '#ff1493', size: 0.28, speed: 0.45 },
]

export default function Scene3Birthday() {
  return (
    <>
      <color attach="background" args={['#010010']} />
      <fog attach="fog" args={['#010010', 9, 26]} />

      <ambientLight intensity={0.25} />
      <pointLight position={[-5, 5, 2]} intensity={40} color={CYAN} distance={20} />
      <pointLight position={[5, -5, 2]} intensity={40} color={PURPLE} distance={20} />

      <CameraRig />
      <FallingStars />

      <Stars radius={55} depth={18} count={500} factor={2.8} saturation={0.7} fade speed={0.4} />

      {ORB_CONFIGS.map((o, i) => (
        <FloatingOrb key={i} position={o.pos} color={o.color} speed={o.speed} size={o.size} />
      ))}

      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.85} intensity={1.4} height={128} />
        <Vignette offset={0.28} darkness={0.82} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>

      <Html fullscreen zIndexRange={[50, 0]}>
        <div style={{
          width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',

          padding: '40px 24px 100px 24px',
          pointerEvents: 'none', boxSizing: 'border-box',
        }}>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} style={{ pointerEvents: 'none', width: '100%', display: 'flex', justifyContent: 'center' }}>

            <motion.div
              className="bday-card"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              style={{
                width: '100%',
                maxWidth: '520px', 
                padding: '36px 40px', 
                position: 'relative',
                pointerEvents: 'auto',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                boxSizing: 'border-box'
              }}
            >

              {/* Foto Profil */}
              <motion.div
                variants={itemVariants}
                style={{
                  width: '100px', height: '100px', 
                  borderRadius: '50%',
                  background: `url(${profile.avatar}) center/cover`,
                  border: '3px solid rgba(0,207,255,0.85)',
                  boxShadow: '0 0 32px rgba(0,207,255,0.4)',
                  marginBottom: '20px' 
                }}
              />

              {/* === KONTEN TEKS === */}
              <motion.div variants={itemVariants} className="s5-section-label" style={{ marginBottom: '8px', color: CYAN, letterSpacing: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                BIRTHDAY EXPERIENCE
              </motion.div>

              <motion.div variants={itemVariants} className="s5-header-title" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', fontWeight: 800, marginBottom: '4px', letterSpacing: '2px' }}>
                HAPPY BIRTHDAY
              </motion.div>

              <motion.div variants={itemVariants} style={{
                fontSize: 'clamp(60px, 12vw, 90px)', 
                fontWeight: 900, lineHeight: 1.1,
                background: 'linear-gradient(135deg,#00cfff,#9b00ff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(0,207,255,0.4))',
                marginBottom: '12px',
              }}>
                18
              </motion.div>

              <motion.div variants={itemVariants} className="bday-name" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 400, letterSpacing: '3px', marginBottom: '8px' }}>
                {profile.name}
              </motion.div>

              <motion.div variants={itemVariants} className="s5-badge" style={{ margin: '12px 0 24px 0', padding: '6px 20px' }}>
                <span className="s5-badge-dot" />
                <span className="s5-badge-prefix">@</span>
                {profile.username}
              </motion.div>

              <motion.div variants={itemVariants} className="s5-section-text" style={{
                maxWidth: '90%',
                marginBottom: '16px',
                textAlign: 'center',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                Selamat datang di usia ke-18.<br />
                Sebuah langkah baru menuju masa depan yang penuh peluang.<br />
                Teruslah berkembang, berkarya, dan membangun sesuatu yang bermakna.
              </motion.div>

              <motion.div variants={itemVariants} className="bday-divider" style={{ marginTop: 'auto' }} />
            </motion.div>

          </motion.div>
        </div>
      </Html>
    </>
  )
}