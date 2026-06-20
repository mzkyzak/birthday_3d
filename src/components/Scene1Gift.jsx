import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, Stars, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { motion } from 'framer-motion'


const BOX_COLOR = '#E8C4A0'
const BOX_COLOR2 = '#D4956A'
const ROSE_GOLD = '#D6A77A'
const ROSE_GOLD_EMI = '#C8924A'
const CYAN_GLOW = '#7EEBFF'
const CRYSTAL_COLOR = '#BDF6FF'
const WARM_GOLD = '#FFD580'


const _scaleVec = new THREE.Vector3()
const _euler = new THREE.Euler()


const fpsValue = { current: 60 }

function FPSTracker() {
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useFrame(() => {
    frameCount.current++
    const now = performance.now()
    const delta = now - lastTime.current
    if (delta >= 500) {
      fpsValue.current = Math.round((frameCount.current / delta) * 1000)
      frameCount.current = 0
      lastTime.current = now
    }
  })

  return null
}


function FPSDisplay() {
  const [fps, setFps] = useState(60)

  useEffect(() => {
    const id = setInterval(() => setFps(fpsValue.current), 500)
    return () => clearInterval(id)
  }, [])

  const color = fps >= 55 ? '#00FF88' : fps >= 30 ? '#FFD580' : '#FF4444'

  return (
    <div style={{
      position: 'fixed', top: 12, right: 12,
      background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${color}44`,
      borderRadius: 8, padding: '5px 10px',
      fontFamily: 'monospace', fontSize: 11,
      color, zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 6,
      letterSpacing: 1,
      boxShadow: `0 0 10px ${color}22`,
      userSelect: 'none',
    }}>
      <div style={{
        width: 6, height: 6, borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px ${color}`,
        animation: 'fpsPulse 1s ease-in-out infinite',
      }} />
      {fps} FPS
    </div>
  )
}


function useTypewriter(phrases, speed = 80, pause = 1800, delSpeed = 40) {
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const [deleting, setDel] = useState(false)

  useEffect(() => {
    const cur = phrases[idx]
    let timeout
    if (!deleting && text.length < cur.length) {
      timeout = setTimeout(() => setText(cur.slice(0, text.length + 1)), speed)
    } else if (!deleting && text.length === cur.length) {
      timeout = setTimeout(() => setDel(true), pause)
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), delSpeed)
    } else if (deleting && text.length === 0) {
      setDel(false)
      setIdx((idx + 1) % phrases.length)
    }
    return () => clearTimeout(timeout)
  }, [text, deleting, idx, phrases, speed, pause, delSpeed])

  return text
}


function MouseOrbit({ targetRef }) {
  const { gl } = useThree()
  const mouse = useRef({ x: 0, y: 0, dragging: false, lastX: 0, lastY: 0 })
  const rotY = useRef(0)
  const rotX = useRef(0)
  const velY = useRef(0)
  const velX = useRef(0)

  useEffect(() => {
    const canvas = gl.domElement

    const onDown = (e) => {
      mouse.current.dragging = true
      mouse.current.lastX = e.clientX ?? e.touches?.[0]?.clientX
      mouse.current.lastY = e.clientY ?? e.touches?.[0]?.clientY
    }
    const onUp = () => { mouse.current.dragging = false }
    const onMove = (e) => {
      if (!mouse.current.dragging) return
      const cx = e.clientX ?? e.touches?.[0]?.clientX
      const cy = e.clientY ?? e.touches?.[0]?.clientY
      const dx = cx - mouse.current.lastX
      const dy = cy - mouse.current.lastY
      velY.current += dx * 0.004
      velX.current += dy * 0.004
      mouse.current.lastX = cx
      mouse.current.lastY = cy
    }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('touchstart', onDown, { passive: true })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('touchmove', onMove, { passive: true })

    return () => {
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('touchstart', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('touchmove', onMove)
    }
  }, [gl])

  useFrame(() => {
    if (!targetRef.current) return


    velY.current *= 0.88
    velX.current *= 0.88

    rotY.current += velY.current
    rotX.current += velX.current

    rotX.current = Math.max(-0.55, Math.min(0.55, rotX.current))

    targetRef.current.userData.orbitY = rotY.current
    targetRef.current.userData.orbitX = rotX.current
  })

  return null
}


function LuxuryParticles() {
  const ref = useRef()
  const count = 300
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      new THREE.Color(CYAN_GLOW),
      new THREE.Color(ROSE_GOLD),
      new THREE.Color(WARM_GOLD),
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#FFE8D0'),
    ]
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 14
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi) - 2
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.elapsedTime * 0.022
      ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.011) * 0.05
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors sizeAttenuation transparent
        opacity={0.8} size={0.05}
        blending={THREE.AdditiveBlending} depthWrite={false}
      />
    </points>
  )
}


function NebulaBG() {
  const u = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#0A0015') },
    uColor2: { value: new THREE.Color('#060030') },
    uColor3: { value: new THREE.Color('#150A00') },
  }), [])

  const vert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`
  const frag = `
    uniform float uTime; uniform vec3 uColor1,uColor2,uColor3; varying vec2 vUv;
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
      return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
    void main(){
      vec2 uv=vUv; float t=uTime*0.05;
      float v=n(uv*2.+t)*0.5+n(uv*5.-t*1.1)*0.3+n(uv*10.+t*.5)*0.2;
      vec3 col=mix(uColor1,uColor2,v);
      col=mix(col,uColor3,n(uv*3.5+t*0.3)*0.4);
      float d=length(vUv-0.5); col*=1.-d*1.35;
      gl_FragColor=vec4(col,1.);
    }`

  useFrame((s) => { u.uTime.value = s.clock.elapsedTime })

  return (
    <mesh position={[0, 0, -14]} scale={[35, 22, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={u} depthWrite={false} />
    </mesh>
  )
}


function CrystalGem({ isHovered }) {
  const gemRef = useRef()
  const glowRef = useRef()
  const facetRef = useRef()

  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (gemRef.current) {
      gemRef.current.rotation.y = t * 0.75
      gemRef.current.rotation.z = Math.sin(t * 0.55) * 0.14
    }
    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = (isHovered ? 1.6 : 0.7) + Math.sin(t * 2.5) * 0.3
      glowRef.current.material.opacity = isHovered ? 0.5 : 0.25
    }
    if (facetRef.current) {
      facetRef.current.rotation.y = -t * 0.45
      facetRef.current.rotation.x = Math.sin(t * 0.65) * 0.18
    }
  })

  return (
    <group position={[0, 0.42, 0]}>
      <mesh ref={gemRef}>
        <octahedronGeometry args={[0.22, 2]} />
        <meshPhysicalMaterial
          color={CRYSTAL_COLOR}
          transmission={1} thickness={2} ior={1.5}
          roughness={0} metalness={0}
          envMapIntensity={3} transparent opacity={0.9}
          emissive={CYAN_GLOW} emissiveIntensity={0.4}
        />
      </mesh>
      <mesh ref={facetRef}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshPhysicalMaterial
          color={CRYSTAL_COLOR} metalness={0.1} roughness={0.04}
          transparent opacity={0.15}
          side={THREE.DoubleSide} envMapIntensity={5}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.30, 12, 12]} />
        <meshStandardMaterial
          color={CYAN_GLOW} emissive={CYAN_GLOW} emissiveIntensity={0.7}
          transparent opacity={0.25}
          blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false}
        />
      </mesh>
      <pointLight color={CYAN_GLOW} intensity={isHovered ? 3.5 : 1.2} distance={3} decay={2} />
    </group>
  )
}


function RibbonCross({ isHovered }) {
  const ref = useRef()
  useFrame((s) => {
    if (!ref.current) return
    const t = s.clock.elapsedTime
    ref.current.children.forEach((child, i) => {
      if (child.material) {
        child.material.emissiveIntensity = (isHovered ? 1.0 : 0.55) + Math.sin(t * 2 + i) * 0.22
      }
    })
  })
  const mat = (
    <meshPhysicalMaterial
      color={ROSE_GOLD} emissive={ROSE_GOLD_EMI} emissiveIntensity={0.55}
      metalness={0.92} roughness={0.08} clearcoat={1} clearcoatRoughness={0.06}
      envMapIntensity={3} toneMapped={false}
    />
  )
  return (
    <group ref={ref} position={[0, 0.18, 0]}>
      <mesh><boxGeometry args={[2.15, 0.10, 0.12]} />{mat}</mesh>
      <mesh><boxGeometry args={[0.12, 0.10, 2.15]} />{mat}</mesh>
    </group>
  )
}


const edgeMat = (
  <meshPhysicalMaterial
    color={ROSE_GOLD} emissive={ROSE_GOLD_EMI} emissiveIntensity={0.35}
    metalness={0.95} roughness={0.07} envMapIntensity={3} toneMapped={false}
  />
)
function BorderEdge({ position, rotation, scale }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 0.022, 0.022]} />
      {edgeMat}
    </mesh>
  )
}


function GiftBox3D({ onClick, isHovered, orbitRef }) {
  const group = useRef()
  const lid = useRef()
  const bodyRef = useRef()
  const glowSphere = useRef()


  useEffect(() => {
    if (orbitRef) orbitRef.current = group.current
  }, [orbitRef])

  useFrame((s) => {
    if (!group.current) return
    const t = s.clock.elapsedTime
    const oY = group.current.userData.orbitY ?? 0
    const oX = group.current.userData.orbitX ?? 0


    group.current.position.y =
      Math.sin(t * 0.52) * 0.18 +
      Math.sin(t * 0.25) * 0.08 +
      Math.sin(t * 1.05) * 0.025


    group.current.rotation.y = t * 0.10 + Math.sin(t * 0.32) * 0.08 + oY
    group.current.rotation.x = Math.sin(t * 0.40) * 0.030 + oX
    group.current.rotation.z = Math.sin(t * 0.26) * 0.015


    const sc = isHovered ? 1.07 : 1.0
    _scaleVec.set(sc, sc, sc)
    group.current.scale.lerp(_scaleVec, 0.08)


    if (lid.current) {
      lid.current.rotation.x = THREE.MathUtils.lerp(
        lid.current.rotation.x, isHovered ? -0.20 : 0, 0.06
      )
    }


    if (bodyRef.current) {
      bodyRef.current.material.envMapIntensity = 2.2 + Math.sin(t * 1.1) * 0.5
    }


    if (glowSphere.current) {
      glowSphere.current.material.opacity = isHovered
        ? 0.055 + Math.sin(t * 2) * 0.022
        : 0.018 + Math.sin(t * 1.4) * 0.008
    }
  })

  const boxMat = (
    <meshPhysicalMaterial
      color={BOX_COLOR}
      metalness={0.35}
      roughness={0.18}
      clearcoat={1}
      clearcoatRoughness={0.06}
      envMapIntensity={2.2}
      reflectivity={0.75}
      emissive={ROSE_GOLD}
      emissiveIntensity={0.06}
      sheen={0.4}
      sheenColor={WARM_GOLD}
      sheenRoughness={0.3}
    />
  )

  const lidMat = (
    <meshPhysicalMaterial
      color={BOX_COLOR2}
      metalness={0.40}
      roughness={0.14}
      clearcoat={1}
      clearcoatRoughness={0.04}
      envMapIntensity={2.8}
      emissive={ROSE_GOLD_EMI}
      emissiveIntensity={0.05}
      sheen={0.5}
      sheenColor={WARM_GOLD}
      sheenRoughness={0.25}
    />
  )

  return (
    <group ref={group} onClick={onClick}>

      {/* ── Badan Kotak ── */}
      <mesh ref={bodyRef} castShadow receiveShadow>
        <boxGeometry args={[2, 1.75, 2]} />
        {boxMat}
      </mesh>

      {/* ── Tepi Bawah (Rose Gold) ── */}
      <BorderEdge position={[1, -0.875, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1.75, 1, 1]} />
      <BorderEdge position={[-1, -0.875, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1.75, 1, 1]} />
      <BorderEdge position={[0, -0.875, 1]} rotation={[0, Math.PI / 2, 0]} scale={[2, 1, 1]} />
      <BorderEdge position={[0, -0.875, -1]} rotation={[0, Math.PI / 2, 0]} scale={[2, 1, 1]} />
      {/* ── Tepi Atas Badan ── */}
      <BorderEdge position={[1, 0.875, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1.75, 1, 1]} />
      <BorderEdge position={[-1, 0.875, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1.75, 1, 1]} />
      <BorderEdge position={[0, 0.875, 1]} rotation={[0, Math.PI / 2, 0]} scale={[2, 1, 1]} />
      <BorderEdge position={[0, 0.875, -1]} rotation={[0, Math.PI / 2, 0]} scale={[2, 1, 1]} />

      {/* ── Pita Vertikal ── */}
      <mesh>
        <boxGeometry args={[0.12, 2.18, 0.12]} />
        <meshPhysicalMaterial
          color={ROSE_GOLD} emissive={ROSE_GOLD_EMI} emissiveIntensity={0.5}
          metalness={0.92} roughness={0.10} envMapIntensity={3}
          clearcoat={1} clearcoatRoughness={0.07} toneMapped={false}
        />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.12, 2.18, 0.12]} />
        <meshPhysicalMaterial
          color={ROSE_GOLD} emissive={ROSE_GOLD_EMI} emissiveIntensity={0.5}
          metalness={0.92} roughness={0.10} envMapIntensity={3}
          clearcoat={1} clearcoatRoughness={0.07} toneMapped={false}
        />
      </mesh>

      {/* ── Tutup Kotak ── */}
      <group ref={lid} position={[0, 0.955, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.1, 0.31, 2.1]} />
          {lidMat}
        </mesh>
        {/* Tepi tutup */}
        <BorderEdge position={[1.05, 0.155, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.31, 1, 1]} />
        <BorderEdge position={[-1.05, 0.155, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.31, 1, 1]} />
        <BorderEdge position={[0, 0.155, 1.05]} rotation={[0, Math.PI / 2, 0]} scale={[0.31, 1, 1]} />
        <BorderEdge position={[0, 0.155, -1.05]} rotation={[0, Math.PI / 2, 0]} scale={[0.31, 1, 1]} />
        {/* Pita silang atas tutup */}
        <RibbonCross isHovered={isHovered} />
        {/* Permata kristal */}
        <CrystalGem isHovered={isHovered} />
      </group>

      {/* ── Lapisan Cahaya Sekitar ── */}
      <mesh ref={glowSphere}>
        <sphereGeometry args={[2.2, 20, 20]} />
        <meshStandardMaterial
          color={WARM_GOLD} emissive={WARM_GOLD} emissiveIntensity={1}
          transparent opacity={0.018}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false}
        />
      </mesh>

    </group>
  )
}


const PHRASES = [
  'Hari Ini Adalah ulang tahunku ke 18  ✨',
  '2008-06-18  ✨',
  'Selamat Datang',
  'Di Perjalanan Ini 🌟',
  'Masa Depan Dimulai Dari Sini 🚀',
  'Klik Kado Untuk Memulai 🎁',
]


export default function Scene1Gift({ onGiftClick }) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const typed = useTypewriter(PHRASES, 65, 2200, 30)
  const orbitRef = useRef(null)

  const handleClick = useCallback(() => {
    if (clicked) return
    setClicked(true)
    setTimeout(onGiftClick, 200)
  }, [clicked, onGiftClick])

  const onEnter = useCallback(() => setHovered(true), [])
  const onLeave = useCallback(() => setHovered(false), [])

  return (
    <>
      <NebulaBG />
      {/* FPS tracker harus ada di dalam canvas context */}
      <FPSTracker />

      {/* ── Sistem Pencahayaan ── */}
      <ambientLight intensity={0.5} color="#F5EEDD" />
      <directionalLight position={[3, 8, 4]} intensity={1.6} color="#FFF5E8" castShadow />
      <pointLight position={[-4, 3, 5]} intensity={22} color="#F5ECFF" distance={20} decay={2} />
      <pointLight position={[5, 2, -3]} intensity={30} color={CYAN_GLOW} distance={18} decay={2} />
      <pointLight position={[-3, -2, -5]} intensity={24} color={ROSE_GOLD} distance={16} decay={2} />
      <pointLight position={[0, -4, 2]} intensity={18} color="#FFE8C0" distance={12} decay={2} />
      <pointLight position={[2, 5, 2]} intensity={20} color={WARM_GOLD} distance={14} decay={2} />
      <spotLight
        position={[0, 9, 3]} intensity={55} angle={0.35}
        penumbra={0.85} color="#FFFAF0" castShadow
      />

      <fog attach="fog" args={['#06001A', 14, 32]} />

      {/* ── Bintang ── */}
      <LuxuryParticles />
      <Stars radius={60} depth={20} count={2000} factor={2.5} saturation={0.5} fade speed={0.35} />

      {/* ── Environment HDRI ── */}
      <Environment preset="studio" />

      {/* ── Orbit Mouse ── */}
      <MouseOrbit targetRef={orbitRef} />

      {/* ── Kotak Kado ── */}
      <group
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
      >
        <GiftBox3D onClick={handleClick} isHovered={hovered} orbitRef={orbitRef} />
      </group>

      {/* Area klik tak terlihat */}
      <mesh position={[0, 0, 0]} onClick={handleClick} onPointerEnter={onEnter} onPointerLeave={onLeave}>
        <boxGeometry args={[4.5, 4.5, 4.5]} />
        <meshBasicMaterial transparent opacity={0} colorWrite={false} depthWrite={false} />
      </mesh>

      {/* ── Post Processing ── */}
      <EffectComposer>
        <Bloom intensity={0.75} luminanceThreshold={0.25} luminanceSmoothing={0.88} height={300} />
        <Vignette offset={0.28} darkness={0.50} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>

      {/* ── UI Overlay ── */}
      <Html fullscreen zIndexRange={[100, 0]}>
        {/* Teks typewriter di bawah */}
        <div className="scene1-ui">
          <motion.div
            className="typewriter-wrap"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.5 }}
          >
            <span className="typewriter-text">{typed}</span>
            <span className="typewriter-cursor">|</span>
          </motion.div>
        </div>

        {/* Label atas */}
        <div className="scene-watermark">mzkyzak</div>

        {/* FPS Meter */}
        <FPSDisplay />
      </Html>
    </>
  )
}
