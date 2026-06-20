import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'
import { portalVertexShader, portalFragmentShader } from '../shaders/portalShader'


function TorusRings() {
  const rings = useRef([])
  const configs = useMemo(() => [
    { radius: 3.2, tube: 0.04, color: '#00cfff', speed: 0.3, axis: 'z' },
    { radius: 3.5, tube: 0.03, color: '#9b00ff', speed: -0.25, axis: 'z' },
    { radius: 3.0, tube: 0.05, color: '#00cfff', speed: 0.4, axis: 'y' },
    { radius: 3.8, tube: 0.025, color: '#ff1493', speed: -0.35, axis: 'x' },
    { radius: 2.8, tube: 0.035, color: '#9b00ff', speed: 0.45, axis: 'y' },
    { radius: 4.0, tube: 0.02, color: '#00cfff', speed: -0.2, axis: 'x' },
  ], [])

  useFrame((s) => {
    const t = s.clock.elapsedTime
    rings.current.forEach((ref, i) => {
      if (!ref) return
      const c = configs[i]
      if (c.axis === 'z') ref.rotation.z = t * c.speed
      if (c.axis === 'y') ref.rotation.y = t * c.speed
      if (c.axis === 'x') ref.rotation.x = t * c.speed

      ref.material.emissiveIntensity = 3 + Math.sin(t * 2 + i) * 1.5
    })
  })

  return (
    <group>
      {configs.map((c, i) => (
        <mesh key={i} ref={(el) => { rings.current[i] = el }}>
          <torusGeometry args={[c.radius, c.tube, 16, 100]} />
          <meshStandardMaterial
            color={c.color}
            emissive={c.color}
            emissiveIntensity={3}
            toneMapped={false}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  )
}


function PortalSurface() {
  const ref = useRef()
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorStart: { value: new THREE.Color('#1a0050') },
    uColorEnd: { value: new THREE.Color('#00cfff') },
    uColorMid: { value: new THREE.Color('#9b00ff') },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  }), [])

  useEffect(() => {
    const onMove = (e) => {
      uniforms.uMouse.value.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight
      )
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [uniforms])

  useFrame((s) => { uniforms.uTime.value = s.clock.elapsedTime })

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <planeGeometry args={[5.5, 5.5, 32, 32]} />
      <shaderMaterial
        vertexShader={portalVertexShader}
        fragmentShader={portalFragmentShader}
        uniforms={uniforms}
        transparent side={THREE.DoubleSide} depthWrite={false}
      />
    </mesh>
  )
}


function NeonBG() {
  const ref = useRef()
  const u = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  }), [])

  const v = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`
  const f = `
    uniform float uTime; uniform vec2 uMouse; varying vec2 vUv;
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
      return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
    void main(){
      vec2 uv=vUv; vec2 md=(uMouse-0.5)*0.12;
      uv+=md*(1.0-length(uv-0.5));
      float t=uTime*0.1;
      float n1=n(uv*2.5+t),n2=n(uv*5.0-t*1.3),n3=n(uv*10.0+t*0.7);
      float v=n1*0.5+n2*0.3+n3*0.2;
      vec3 c1=vec3(0.04,0.0,0.22), c2=vec3(0.0,0.06,0.3), c3=vec3(0.15,0.0,0.28);
      vec3 col=mix(c1,c2,v); col=mix(col,c3,n(uv*3.0+t*0.5)*0.6);
      float vein1=abs(sin(uv.y*12.0+uTime*1.5+v*4.0));
      float vein2=abs(sin(uv.x*8.0-uTime*1.2+v*3.0));
      col+=vec3(0.0,0.3,0.7)*pow(1.0-vein1,8.0)*0.35;
      col+=vec3(0.35,0.0,0.7)*pow(1.0-vein2,8.0)*0.35;
      float d=length(vUv-0.5); col*=1.0-d*1.3;
      float mg=length(vUv-uMouse); col+=vec3(0.0,0.4,0.9)*exp(-mg*5.0)*0.4;
      gl_FragColor=vec4(col,1.0);
    }`

  useEffect(() => {
    const onMove = (e) => {
      u.uMouse.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [u])

  useFrame((s) => { u.uTime.value = s.clock.elapsedTime })

  return (
    <mesh ref={ref} position={[0, 0, -12]} scale={[35, 22, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial vertexShader={v} fragmentShader={f} uniforms={u} depthWrite={false} />
    </mesh>
  )
}


function EnergyOrbs() {
  const orbConfigs = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      angle: (i / 20) * Math.PI * 2,
      radius: 3.2 + Math.random() * 2.5,
      speed: 0.12 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
      color: i % 3 === 0 ? '#00cfff' : i % 3 === 1 ? '#9b00ff' : '#ff1493',
      size: 0.03 + Math.random() * 0.06,
    }))
    , [])

  const refs = useRef([])

  useFrame((s) => {
    const t = s.clock.elapsedTime
    refs.current.forEach((ref, i) => {
      if (!ref) return
      const o = orbConfigs[i]
      const a = o.angle + t * o.speed
      ref.position.x = Math.cos(a) * o.radius
      ref.position.y = Math.sin(a * 0.7 + o.phase) * 3
      ref.position.z = Math.sin(a) * 1.5 - 2
    })
  })

  return (
    <>
      {orbConfigs.map((o, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el }}>
          <sphereGeometry args={[o.size, 8, 8]} />
          <meshStandardMaterial
            color={o.color} emissive={o.color} emissiveIntensity={2}
            transparent opacity={0.15}
            blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false}
          />
        </mesh>
      ))}
    </>
  )
}


function CameraRig({ onFlyComplete }) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 14)
    camera.fov = 42
    camera.updateProjectionMatrix()

    const tl = gsap.timeline({
      onComplete: () => {
        if (onFlyComplete) onFlyComplete()
      }
    })

    tl.to(camera.position, {
      z: 6,
      duration: 3,
      ease: 'power2.inOut'
    })
      .to(camera.position, {
        z: -5,
        duration: 1.5,
        ease: 'power4.in'
      })
      .to(camera, {
        fov: 110,
        duration: 1.5,
        ease: 'power4.in',
        onUpdate: () => camera.updateProjectionMatrix()
      }, '<')

    return () => tl.kill()
  }, [camera, onFlyComplete])

  return null
}

function PortalScene({ onComplete, onBack }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, -6]} intensity={100} color="#00cfff" distance={25} />
      <fog attach="fog" args={['#02000f', 5, 25]} />

      <NeonBG />
      <TorusRings />
      <PortalSurface />
      <EnergyOrbs />

      <Sparkles count={500} scale={20} size={1.5} speed={0.4} opacity={0.6} color="#00cfff" position={[0, 0, -10]} />
      <Stars radius={60} depth={20} count={3000} factor={2} saturation={0.8} fade speed={0.5} />

      <CameraRig onFlyComplete={onComplete} />

      <EffectComposer disableNormalPass>
        <Bloom intensity={3.5} luminanceThreshold={0.1} luminanceSmoothing={0.9} height={350} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.003, 0.003]} />
        <Vignette offset={0.3} darkness={0.8} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    </>
  )
}


export default function PortalCinematic({ onComplete, onBack }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#02000f', zIndex: 1000 }}>
      <Canvas
        camera={{ position: [0, 0, 14], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', precision: 'highp' }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <PortalScene onComplete={onComplete} onBack={onBack} />
      </Canvas>
    </div>
  )
}