# 🔧 Technical Documentation

Dokumentasi teknis lengkap untuk developer yang ingin memahami atau memodifikasi project ini.

## 🏗️ Architecture Overview

### Tech Stack

```
React 19.2.6
├── Three.js (3D Engine)
├── React Three Fiber (React renderer untuk Three.js)
├── Drei (Helper components & abstractions)
├── Postprocessing (Visual effects)
├── Framer Motion (UI animations)
├── GSAP (Timeline animations)
└── Vite 8 (Build tool)
```

### Component Hierarchy

```
App.jsx
├── AudioManager (Sound effects)
├── Canvas (R3F)
│   ├── Scene1GiftBox (3D Scene)
│   ├── Scene2Portal (3D Scene)
│   ├── Scene3MemoryTunnel (3D Scene)
│   └── Scene4Reveal (3D Scene)
└── DOM Overlay
    ├── Scene5Message (2D UI)
    └── Scene6Celebration (2D UI)
```

---

## 📦 Scene Breakdown

### Scene 1: Gift Box

**File:** `Scene1GiftBox.jsx`

**Technologies:**
- `MeshTransmissionMaterial` - Glassmorphism effect
- `Float` - Floating animation
- `SpotLight` - Dramatic lighting
- `Environment` - HDR environment map
- `Bloom` + `DepthOfField` - Post processing

**Key Components:**
```jsx
<GiftBox />          // Main 3D gift box
<Particles />        // Ambient particles
<Float>              // Floating animation wrapper
<EffectComposer>     // Post-processing pipeline
```

**Performance Notes:**
- Particles: 150 instances
- Shadow mapping: Enabled
- Real-time reflections: Via environment map

---

### Scene 2: Portal Transition

**File:** `Scene2Portal.jsx`

**Technologies:**
- `MeshDistortMaterial` - Animated distortion
- `Sparkles` - Particle explosion
- `ChromaticAberration` - Lens effect
- `Vignette` - Dark edges
- GSAP camera animation

**Key Features:**
- Portal grows from 0 to 2x scale
- Camera zoom from z:5 to z:-10
- FOV animation 75° → 120°
- 1000 explosion particles
- Dual rotating torus geometry

**Animation Timeline:**
```
0s:     Portal appears
1s:     Camera starts moving
3s:     Maximum speed
3.5s:   Scene transition
```

---

### Scene 3: Memory Tunnel

**File:** `Scene3MemoryTunnel.jsx`

**Technologies:**
- Procedural cylinder tunnel
- Hologram text with `Text` component
- Grid floor animation
- `Stars` background
- `MotionBlur` effect

**Key Components:**
```jsx
<TunnelWalls />         // Wireframe cylinder
<GridFloor />           // Moving grid
<Hologram />            // Technology labels
<FloatingParticles />   // Space particles
```

**Technologies Displayed:**
- HTML, CSS, JavaScript
- PHP, MySQL, Laravel
- Android, Custom ROM

**Animation:**
- Camera moves z:0 → z:-30 in 6 seconds
- Grid scrolls infinitely
- Holograms fade in/out with sine wave

---

### Scene 4: Reveal

**File:** `Scene4Reveal.jsx`

**Technologies:**
- Glass frame with transmission material
- Particle to solid transition
- `Float` wrapper for gentle movement
- Rotating colored lights
- Multiple bloom passes

**Key Features:**
- Frame assembles from particles (2s elastic animation)
- Name and username reveal
- Dynamic lighting system
- Glassmorphism frame design
- Background ambient particles

**Materials:**
```jsx
MeshTransmissionMaterial {
  thickness: 0.5
  roughness: 0
  transmission: 0.95
  ior: 1.5
  chromaticAberration: 0.5
}
```

---

### Scene 5: Cinematic Message

**File:** `Scene5Message.jsx`

**Technologies:**
- Framer Motion layout animations
- Custom typewriter effect
- React state management
- CSS gradient animations
- Floating particles system

**Messages:**
1. "Selamat Ulang Tahun ke-18" (Special)
2. "Teruslah berkembang."
3. "Teruslah berkarya."
4. "Teruslah menciptakan masa depanmu."
5. "The Best Is Yet To Come." (Special)

**Animation Logic:**
```javascript
// Sequential typewriter
message[0] → wait 800ms → message[1] → ... → complete

// Character timing: 50ms per char
// Cursor blink: 1s interval
```

---

### Scene 6: Celebration

**File:** `Scene6Celebration.jsx`

**Technologies:**
- Framer Motion spring animations
- Procedural confetti system
- Firework particles
- Achievement cards grid
- Glassmorphism UI

**Effects:**
- 100 confetti pieces (continuous)
- 8 fireworks (sequential)
- 4 achievement cards
- Radial gradient background
- Pulsing glow effect

**Confetti Physics:**
```javascript
// Random X position: 0-100vw
// Fall duration: 2-4s
// Rotation: 0-1080deg
// Colors: 7 vibrant colors
```

**Firework Timing:**
```javascript
// Firework[n] launches at: n * 300ms
// 20 particles per explosion
// Radial burst pattern (360°)
```

---

## 🎨 Styling System

### CSS Architecture

```
index.css           → Global styles & utilities
App.css             → Scene-specific styles
Components          → Scoped styles via CSS Modules
```

### Design Tokens

```css
:root {
  --color-primary: #8a2be2;      /* Purple */
  --color-secondary: #00bfff;    /* Cyan */
  --color-accent: #ff1493;       /* Deep Pink */
  --color-gold: #ffd700;         /* Gold */
  --color-bg: #000000;           /* Black */
  --color-bg-light: #0a0a1a;     /* Dark Blue */
}
```

### Glassmorphism Effect

```css
.glassmorphism {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
```

---

## 🎬 Animation System

### GSAP Timeline

Used for camera movements and complex sequences:

```javascript
gsap.to(camera.position, {
  z: -30,
  duration: 6,
  ease: 'none'
})
```

### Framer Motion

Used for DOM elements and UI transitions:

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8 }}
/>
```

### React Three Fiber useFrame

Used for continuous animations:

```javascript
useFrame((state) => {
  mesh.rotation.y = state.clock.elapsedTime
})
```

---

## 🎮 Performance Optimization

### Bundle Splitting

```javascript
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'three-vendor': ['three', '@react-three/fiber'],
  'postprocessing-vendor': ['postprocessing'],
  'animation-vendor': ['gsap', 'framer-motion']
}
```

### Three.js Optimizations

1. **Geometry Reuse**
   - Single geometry, multiple instances
   - Buffer geometry for particles

2. **Material Sharing**
   - Shared materials across meshes
   - Texture atlasing where possible

3. **Render Optimization**
   ```javascript
   gl={{
     antialias: true,
     alpha: true,
     powerPreference: "high-performance"
   }}
   ```

4. **Post-processing**
   - Reduced resolution for effects
   - Selective bloom passes
   - Optimized shader code

### Loading Strategy

```javascript
// Progressive loading
1. HTML skeleton
2. Critical CSS
3. React bundle
4. Three.js + dependencies
5. 3D assets (lazy)
```

---

## 🔊 Audio System

### Web Audio API

**File:** `AudioManager.jsx`

```javascript
AudioContext
├── Oscillator (Tone generator)
├── GainNode (Volume control)
└── Destination (Output)
```

**Sound Design:**
- Scene 1: 200Hz, mystical
- Scene 2: 400Hz, portal whoosh
- Scene 3: 300Hz, tunnel speed
- Scene 4: 800Hz, reveal chime
- Scene 6: 600Hz, celebration

---

## 🎯 Event Flow

### Scene Transitions

```
User clicks gift
    ↓
isTransitioning = true
    ↓
500ms delay
    ↓
currentScene = 2
    ↓
Portal animation (3s)
    ↓
onComplete()
    ↓
currentScene = 3
    ↓
... continues
```

### State Management

```javascript
// Main App state
const [currentScene, setCurrentScene] = useState(1)
const [isTransitioning, setIsTransitioning] = useState(false)

// Scene-specific state
const [showContent, setShowContent] = useState(false)
const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
```

---

## 🛠️ Development Tools

### Hot Module Replacement (HMR)

Vite HMR preserves state during development:
- React Fast Refresh
- Three.js scene preservation
- Style hot reload

### Debug Mode

Add to any scene for debug helpers:

```javascript
import { OrbitControls, Stats } from '@react-three/drei'

<OrbitControls />
<Stats />
```

### Performance Monitoring

```javascript
// FPS counter
<Stats />

// Chrome DevTools
// Performance tab → Record → Analyze
```

---

## 📊 Browser Compatibility

### Required Features

- WebGL 2.0 ✅
- ES6+ JavaScript ✅
- CSS Grid & Flexbox ✅
- Web Audio API ✅

### Tested Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 15+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |

### Fallbacks

- No WebGL → Show error message
- No Web Audio → Silent mode
- Reduced motion → Disable effects

---

## 🐛 Common Issues & Solutions

### Issue: Low FPS

**Diagnosis:**
```javascript
// Add FPS counter
import { Stats } from '@react-three/drei'
<Stats />
```

**Solutions:**
1. Reduce particle count
2. Disable heavy post-processing (MotionBlur, DoF)
3. Lower resolution
4. Disable shadows

### Issue: Memory Leak

**Check for:**
- Unmounted timers
- Event listeners not cleaned
- Three.js objects not disposed

**Solution:**
```javascript
useEffect(() => {
  return () => {
    // Cleanup
    geometry.dispose()
    material.dispose()
  }
}, [])
```

### Issue: Texture/Asset Loading

**Solution:**
```javascript
import { useProgress } from '@react-three/drei'

const { progress } = useProgress()
// Show loading: {progress}%
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] All 6 scenes load correctly
- [ ] Transitions are smooth
- [ ] No console errors
- [ ] Audio plays correctly
- [ ] Text is readable
- [ ] Responsive on mobile
- [ ] Performance is acceptable

### Performance Benchmarks

Target metrics:
- FPS: 60fps (desktop), 30fps (mobile)
- Load time: < 3s
- Time to interactive: < 5s

---

## 🔐 Security Considerations

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

### XSS Prevention

- No user input
- No dynamic script injection
- Sanitized data (if added later)

---

## 📚 Resources & References

### Documentation
- [Three.js Docs](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Drei](https://github.com/pmndrs/drei)
- [Framer Motion](https://www.framer.com/motion/)
- [GSAP](https://greensock.com/docs/)

### Learning Resources
- [Three.js Journey](https://threejs-journey.com/)
- [React Three Fiber Course](https://www.youtube.com/c/PmdrsOrg)

---

## 🤝 Contributing

Untuk kontribusi:

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📝 Code Style

- ESLint config included
- Prettier for formatting
- 2 spaces indentation
- Semicolons required

---

**Happy Coding!** 💻✨
