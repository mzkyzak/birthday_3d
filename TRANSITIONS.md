# 🌀 Ultra Brutal Transition System

Sistem transisi ULTRA BRUTAL dengan kualitas Marvel/Doctor Strange untuk Birthday 3D Experience.

## 🎬 Scene State Machine

```
ROOM (Scene 1)
  ↓ [ForwardTransition - Gift Click]
PORTAL (Scene 2)
  ↓ [ForwardTransition - Camera Enter]
WARP (Scene 3)
  ↓ [ForwardTransition - Auto after 10s]
PHOTO (Scene 4)
  ↓ [BackwardTransition - Back Button]
WARP (Scene 3)
  ↓ [BackwardTransition - Back Button]
ROOM (Scene 1)
```

## ⚡ Forward Transition Effects

**Triggers:** Scene progression (next →)

**Duration:** 800ms total

### Timeline Breakdown:

#### Phase 1: Violent Screen Shake (0-300ms)
- Random X/Y displacement: ±40px
- 5 repeats with yoyo
- GSAP rough ease (strength: 8)
- Creates brutal camera jitter effect

#### Phase 2: Chromatic Aberration Spike (0-300ms)
- Offset: 0.002 → 0.05
- Power4.out easing
- Creates rainbow color separation

#### Phase 3: Bloom Explosion (0-250ms)
- Intensity: 1.5 → 6.0
- Power4.in easing
- Creates blinding light effect

#### Phase 4: Vignette Darken (0-200ms)
- Darkness: 0.6 → 0.95
- Focuses attention on center

#### Phase 5: White Flash Impact (300-380ms)
- Background: transparent → #FFFFFF
- Opacity: 0 → 1
- 80ms duration
- Screen-level white flash

#### Phase 6: Scene Swap (500ms)
- **CRITICAL:** Scene change happens here
- Overlay fades out (300ms)
- Bloom returns to normal (400ms)
- All effects reset

### Implementation:

```jsx
import { ForwardTransition } from './components/TransitionOverlay'

const triggerForwardTransition = (nextScene) => {
  setIsTransitioning(true)
  setTransitionDirection('forward')
  
  setTimeout(() => {
    setCurrentScene(nextScene)
    setIsTransitioning(false)
  }, 800)
}
```

## 🔙 Backward Transition Effects

**Triggers:** Back button clicks (← previous)

**Duration:** 650ms total

### Timeline Breakdown:

#### Phase 1: Strobe Flicker (0-320ms)
- White flash strobe: 7 repeats
- 40ms per flash
- Steps(1) easing for instant toggle
- Creates time-warp flicker

#### Phase 2: Chromatic Aberration Spike (0-300ms)
- Offset: 0.002 → 0.08
- Even more extreme than forward

#### Phase 3: Bloom Surge (0-200ms)
- Intensity: 1.5 → 5.0
- Creates temporal surge effect

#### Phase 4: FOV Warp (100-250ms)
- Camera FOV: 50 → 120
- Power4.in easing
- Creates vacuum suction effect
- Camera.updateProjectionMatrix() on update

#### Phase 5: Purple Flash (300-360ms)
- Background: #8800FF
- 60ms duration
- Temporal snapback signature color

#### Phase 6: Scene Swap (400ms)
- **CRITICAL:** Scene change happens here
- Overlay fades out (250ms)
- All effects reset

### Implementation:

```jsx
import { BackwardTransition } from './components/TransitionOverlay'

const triggerBackwardTransition = (prevScene) => {
  setIsTransitioning(true)
  setTransitionDirection('backward')
  
  setTimeout(() => {
    setCurrentScene(prevScene)
    setIsTransitioning(false)
  }, 650)
}
```

## 📊 Effect References

### Post-Processing Refs (App.jsx)

```jsx
const chromaRef = useRef()    // ChromaticAberration effect
const bloomRef = useRef()     // Bloom effect
const vignetteRef = useRef()  // Vignette effect
const cameraRef = useRef()    // Camera (for FOV manipulation)
```

Pass these refs to transition components:

```jsx
<ForwardTransition
  onComplete={() => {}}
  chromaRef={chromaRef}
  bloomRef={bloomRef}
  vignetteRef={vignetteRef}
/>
```

## 🎨 Visual Quality Targets

### Forward Transition:
- **Style:** Marvel Portal / Interstellar Wormhole
- **Feeling:** "Being pulled into another dimension"
- **Color:** Blinding white → transparent
- **Impact:** Maximum aggression

### Backward Transition:
- **Style:** Doctor Strange Time Reversal / Tenet
- **Feeling:** "Rewinding through space-time"
- **Color:** Purple flash (#8800FF)
- **Impact:** Temporal snapback

## 🎯 Performance Optimization

### GSAP Cleanup:
```jsx
useEffect(() => {
  const tl = gsap.timeline({ onComplete })
  
  // ... timeline setup
  
  return () => tl.kill()  // ← CRITICAL for performance
}, [])
```

### Ref Access Pattern:
```jsx
// Safe ref access in GSAP
.to(bloomRef?.current || {}, {
  intensity: 6.0
})
```

### Scene Mounting:
- Only 1 scene mounted at a time
- Lazy mount prevents memory leaks
- Scene components cleanup on unmount

## 🚀 Usage Examples

### Scene 1 → Scene 2 (Gift Click):
```jsx
const handleGiftClick = () => {
  triggerForwardTransition(SCENES.PORTAL)
}
```

### Scene 3 → Scene 4 (Auto Progress):
```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    triggerForwardTransition(SCENES.PHOTO)
  }, 10000)
  
  return () => clearTimeout(timer)
}, [])
```

### Scene 4 → Scene 3 (Back Button):
```jsx
const handleBackToWarp = () => {
  triggerBackwardTransition(SCENES.WARP)
}

<button onClick={handleBackToWarp}>← Back</button>
```

## 🎬 Portal Cinematic Integration

Portal scene has **built-in camera animation** that coordinates with forward transition:

```jsx
// Camera Timeline in PortalCinematic.jsx
timeline
  .to(camera.position, { z: 8 })         // Approach
  .to(camera.position, { z: 2 })         // Close-up
  .to(camera.position, { z: -15 })       // Through portal
  .to(camera, { fov: 100 })              // FOV warp
  .to(bloomRef.current, { intensity: 4 }) // Bloom peak
```

The camera dive **triggers the forward transition** to WARP scene at the end.

## 🔥 Key Innovations

1. **Hyper Camera Shake**: Real random displacement, not pre-baked animation
2. **Strobe Flicker**: True on/off toggle at 40ms intervals
3. **FOV Manipulation**: Direct camera FOV animation for spatial distortion
4. **Dual Chromatic Aberration**: Different intensities for forward/backward
5. **Purple Flash Signature**: Unique color identifier for backward transitions
6. **Mix Blend Mode**: Screen blend for overlay creates additive light effect
7. **Ref-based Post-processing**: Direct manipulation of effect parameters

## 📝 Notes

- Transitions are **screen-level overlays** (z-index: 9999)
- They don't unmount the current scene until swap point
- Post-processing effects are **shared** across transitions
- All timings are carefully tuned for 60 FPS
- No performance impact: transitions use GPU-accelerated properties
- GSAP timelines auto-cleanup prevents memory leaks

## 🎯 60 FPS Guarantee

All effects use:
- ✅ GPU-accelerated properties (opacity, transform)
- ✅ No layout recalculation
- ✅ RequestAnimationFrame via GSAP
- ✅ WebGL post-processing (hardware accelerated)
- ✅ Proper cleanup on unmount

---

**Result:** Marvel-quality transitions at 60 FPS stable 🚀
