# Testing Checklist - Birthday 3D

## ✅ Pre-Test Setup

```bash
cd c:\Users\USER\Documents\birthday-3d
npm install
npm run dev
```

Browser: `http://localhost:5173`

## 🧪 Test Scenarios

### Test 1: Scene 1 - Gift Box Loading
**Expected:**
- ✅ Black background with subtle fog
- ✅ Gift box floating in center
- ✅ Gift box rotating slowly
- ✅ Text "You Have A Special Gift" floating above
- ✅ Blue and purple lights visible
- ✅ Custom cursor with cyan glow

**Actions:**
- Hover over gift box → should scale up slightly
- Click gift box → should trigger white flash transition

**Debug if fails:**
- Check browser console for errors
- Verify @react-three/drei is installed
- Check if Float component is imported

---

### Test 2: Forward Transition (Scene 1 → Scene 2)
**Expected:**
- ✅ Brutal screen shake (5 quick shakes)
- ✅ Bright white flash
- ✅ Screen overlay fades out
- ✅ Portal scene appears smoothly

**Timing:** ~900ms total

**Debug if fails:**
- Check console for GSAP errors
- Verify TransitionOverlay component mounted
- Check if overlay z-index is 9999

---

### Test 3: Scene 2 - Portal Cinematic
**Expected:**
- ✅ Portal frame spawns with elastic bounce
- ✅ 4 corner lights (cyan, magenta, purple, cyan)
- ✅ Galaxy vortex shader inside portal (animated)
- ✅ Particle sparkles rotating
- ✅ Camera slowly moves forward (z: 12 → 8 → 2 → -15)
- ✅ FOV increases (50 → 80 → 100)
- ✅ Bloom glow intensifies
- ✅ Auto-triggers forward transition after ~6 seconds

**Timing:** Portal animation ~6-7s, then auto-proceeds to Scene 3

**Debug if fails:**
- Check if portalShader.js loaded correctly
- Verify MeshTransmissionMaterial rendering
- Check camera animation timeline in console
- Verify Sparkles component rendering

---

### Test 4: Forward Transition (Scene 2 → Scene 3)
**Expected:**
- ✅ Same white flash + shake effect
- ✅ ~900ms duration
- ✅ Birthday scene appears

**Debug if fails:**
- Check if onComplete callback fires from PortalCinematic
- Verify setTimeout in App.jsx (900ms)

---

### Test 5: Scene 3 - Birthday Reveal
**Expected:**
- ✅ Black space background
- ✅ 6 floating orbs with glow halos
- ✅ Orbs floating up/down smoothly
- ✅ Text appears center:
  - "Happy Birthday"
  - "18"
  - "Taufiq Ikhsan Muzaky"
  - "@mzkyzak"
- ✅ "← Back" button top-left
- ✅ Auto-proceeds to Scene 4 after 10 seconds

**Actions:**
- Wait 10s → should auto-transition to photos
- OR click "← Back" → should trigger purple flash backward transition

**Debug if fails:**
- Check FloatingOrb component rendering
- Verify Html fullscreen working
- Check birthday-container CSS styles
- Verify timer cleanup on unmount

---

### Test 6: Backward Transition (Scene 3 → Scene 1)
**Expected:**
- ✅ Strobe white flicker (7 fast flashes)
- ✅ Purple flash (#8800FF)
- ✅ ~750ms duration
- ✅ Returns to Scene 1 (gift box)

**Actions:**
- Click "← Back" button in Scene 3

**Debug if fails:**
- Check BackwardTransition component
- Verify steps(1) easing in GSAP
- Check purple flash color

---

### Test 7: Scene 4 - Photo Memories
**Expected:**
- ✅ Gradient animated background
- ✅ Title "Photo Memories" at top
- ✅ 4 cards in 2x2 grid:
  - Private Project (🔒)
  - Mobile Development (📱)
  - Web Development (🌐)
  - Custom ROM (⚙️)
- ✅ Cards fade in with stagger (0.2s delay each)
- ✅ Hover card → scale up + glow effect
- ✅ "← Back" button top-left
- ✅ Purple orb glow in background

**Actions:**
- Hover over cards → should tilt slightly & glow
- Click "← Back" → should trigger purple flash backward transition

**Debug if fails:**
- Check Framer Motion installed
- Verify photo-card CSS animations
- Check glassmorphism backdrop-filter support

---

### Test 8: Backward Transition (Scene 4 → Scene 3)
**Expected:**
- ✅ Strobe purple flicker
- ✅ ~750ms duration
- ✅ Returns to Scene 3 (birthday reveal)

**Actions:**
- Click "← Back" button in Scene 4

---

### Test 9: Custom Cursor
**Expected:**
- ✅ Circular cyan cursor follows mouse
- ✅ Default cursor hidden (cursor: none on body)
- ✅ Hover over button → cursor turns purple + scales up + ring pulse
- ✅ Click → cursor shrinks briefly

**Debug if fails:**
- Check CustomCursor component mounted
- Verify cursor CSS in App.css
- Check cursor z-index (9999)

---

### Test 10: Full Loop Test
**Actions:**
1. Start at Scene 1
2. Click gift → Scene 2
3. Wait for auto → Scene 3
4. Wait 10s → Scene 4
5. Click Back → Scene 3
6. Click Back → Scene 1
7. Repeat loop 3 times

**Expected:**
- ✅ No memory leaks
- ✅ Transitions smooth every time
- ✅ No console errors
- ✅ 60 FPS maintained
- ✅ All animations working

**Debug if fails:**
- Check GSAP timeline cleanup (return () => tl.kill())
- Verify useEffect cleanup in all scenes
- Check Canvas unmount behavior
- Monitor memory in DevTools Performance tab

---

## 🐛 Common Issues & Solutions

### Issue: Blank Screen
**Solution:**
1. Hard refresh (Ctrl+Shift+R)
2. Check console for errors
3. Verify all packages installed: `npm install`
4. Check if WebGL is supported in browser

### Issue: No Transitions
**Solution:**
1. Check if TransitionOverlay imported in App.jsx
2. Verify GSAP installed: `npm list gsap`
3. Check isTransitioning state in App.jsx

### Issue: Gift Box Not Floating
**Solution:**
1. Verify Float from @react-three/drei imported
2. Check if THREE is imported
3. Verify useFrame hook working

### Issue: Portal Not Appearing
**Solution:**
1. Check portalShader.js file exists
2. Verify shader imports correct
3. Check MeshTransmissionMaterial compatibility
4. Try reducing transmission value

### Issue: Custom Cursor Not Working
**Solution:**
1. Check if CustomCursor mounted in App.jsx
2. Verify CSS cursor: none on body
3. Check z-index: 9999
4. Verify pointer-events: none on cursor div

### Issue: Performance Drops
**Solution:**
1. Reduce Sparkles count (300 → 150, 200 → 100)
2. Disable some post-processing effects
3. Lower DPR to [1, 1]
4. Disable shadows if enabled

---

## 📊 Performance Metrics

**Target:**
- 60 FPS stable
- < 100ms transition start lag
- < 200MB memory usage
- Smooth camera animations

**Monitor:**
- Open DevTools → Performance tab
- Record during full loop test
- Check for:
  - Frame drops
  - Long tasks (>50ms)
  - Memory spikes
  - Forced reflows

---

## ✅ Success Criteria

All tests pass with:
- ✅ No console errors
- ✅ 60 FPS stable
- ✅ All transitions working
- ✅ All animations smooth
- ✅ No memory leaks
- ✅ Visually matches spec quality

---

## 🚀 Final Check

```bash
npm run build
npm run preview
```

Test production build for:
- Faster load time
- Optimized assets
- No dev-only bugs
