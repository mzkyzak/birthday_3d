import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene1Gift from './components/Scene1Gift'
import PortalCinematic from './components/PortalCinematic'
import Scene3Birthday from './components/Scene3Birthday'
import Scene4Photos from './components/Scene4Photos'
import Scene5Conclusion from './components/Scene5Conclusion'
import CustomCursor from './components/CustomCursor'
import { ForwardTransition, BackwardTransition } from './components/TransitionOverlay'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const SCENES = {
  GIFT:       'gift',
  PORTAL:     'portal',
  BIRTHDAY:   'birthday',
  PHOTOS:     'photos',
  CONCLUSION: 'conclusion',
}

function App() {
  const [currentScene, setCurrentScene]        = useState(SCENES.GIFT)
  const [isTransitioning, setIsTransitioning]  = useState(false)
  const [transDirection, setTransDirection]     = useState('forward')

  const goTo = (next, dir = 'forward', swapMs = 450, totalMs = 900) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTransDirection(dir)
    setTimeout(() => setCurrentScene(next), swapMs)
    setTimeout(() => setIsTransitioning(false), totalMs)
  }

  const forward  = (next) => goTo(next, 'forward',  450, 900)
  const backward = (prev) => goTo(prev, 'backward', 380, 750)
  const restart  = () => goTo(SCENES.GIFT, 'forward', 450, 900)

  return (
    <>
      <CustomCursor />
      <div className="app-container">

        {/* Scene 1 — Gift */}
        {currentScene === SCENES.GIFT && (
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
          >
            <Scene1Gift onGiftClick={() => forward(SCENES.PORTAL)} />
          </Canvas>
        )}

        {/* Scene 2 — Portal */}
        {currentScene === SCENES.PORTAL && (
          <PortalCinematic
            onComplete={() => forward(SCENES.BIRTHDAY)}
            onBack={() => backward(SCENES.GIFT)}
          />
        )}

        {/* Scene 3 — Birthday */}
        {currentScene === SCENES.BIRTHDAY && (
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
          >
            <Scene3Birthday
              onComplete={() => forward(SCENES.PHOTOS)}
              onBack={() => backward(SCENES.PORTAL)}
            />
          </Canvas>
        )}

        {/* Scene 4 — Photos */}
        {currentScene === SCENES.PHOTOS && (
          <Scene4Photos
            onBack={() => backward(SCENES.BIRTHDAY)}
            onNext={() => forward(SCENES.CONCLUSION)}
          />
        )}

        {/* Scene 5 — Conclusion */}
        {currentScene === SCENES.CONCLUSION && (
          <Scene5Conclusion
            onBack={() => backward(SCENES.PHOTOS)}
            onRestart={restart}
          />
        )}

      </div>

      {/* Global Navigation Overlay (for scenes using Canvas) */}
      <AnimatePresence>
        {!isTransitioning && currentScene === SCENES.GIFT && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="scene-bottom-bar scene-bottom-bar--center"
          >
            <button className="nav-btn nav-btn--primary" onClick={() => forward(SCENES.PORTAL)}>
              <span className="nav-btn-icon">🎁</span> Open Gift
            </button>
          </motion.div>
        )}

        {!isTransitioning && currentScene === SCENES.BIRTHDAY && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="scene-bottom-bar"
          >
            <button className="nav-btn" onClick={() => backward(SCENES.PORTAL)}>← Back</button>
            <button className="nav-btn nav-btn--primary" onClick={() => forward(SCENES.PHOTOS)}>Continue →</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition overlays */}
      {isTransitioning && transDirection === 'forward' && (
        <ForwardTransition onComplete={() => {}} />
      )}
      {isTransitioning && transDirection === 'backward' && (
        <BackwardTransition onComplete={() => {}} />
      )}
    </>
  )
}

export default App
