# ❓ Frequently Asked Questions (FAQ)

Kumpulan pertanyaan yang sering ditanyakan dan solusinya.

---

## 🚀 Getting Started

### Q: Bagaimana cara menjalankan project ini?

**A:** 
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Buka browser ke http://localhost:5173
```

### Q: Node.js versi berapa yang dibutuhkan?

**A:** Node.js 18 atau lebih baru. Check versi dengan:
```bash
node --version
```

### Q: Apakah bisa pakai Yarn atau pnpm?

**A:** Ya! Project ini kompatibel dengan:
- npm (recommended)
- yarn
- pnpm

```bash
# Yarn
yarn install
yarn dev

# pnpm
pnpm install
pnpm dev
```

---

## 🎨 Customization

### Q: Bagaimana cara mengganti nama?

**A:** Edit file `src/components/Scene4Reveal.jsx`:

```jsx
// Line ~85-95
<Text>NAMA BARU ANDA</Text>
<Text>@username_baru</Text>
```

### Q: Bagaimana cara menambah atau mengurangi pesan?

**A:** Edit array di `src/components/Scene5Message.jsx`:

```jsx
const messages = [
  { text: "Pesan pertama", special: true },
  { text: "Pesan kedua", special: false },
  // Tambah sebanyak yang Anda mau
]
```

### Q: Bisa ganti warna tema?

**A:** Ya! Edit `src/index.css`:

```css
:root {
  --color-primary: #8a2be2;    /* Ganti dengan warna favorit */
  --color-secondary: #00bfff;  
  --color-accent: #ff1493;     
}
```

### Q: Bagaimana cara menambah foto profil?

**A:** 
1. Tambahkan foto ke folder `public/images/profile.jpg`
2. Edit `Scene4Reveal.jsx`:

```jsx
// Ganti circle geometry dengan:
<mesh position={[0, 0.8, 0.02]}>
  <planeGeometry args={[1.5, 1.5]} />
  <meshBasicMaterial>
    <texture attach="map" image={useLoader(TextureLoader, '/images/profile.jpg')} />
  </meshBasicMaterial>
</mesh>
```

### Q: Bisa mengubah urutan scene?

**A:** Ya, edit logic di `src/App.jsx`. Tapi hati-hati, urutan scene dirancang untuk storytelling yang koheren.

---

## 🎭 Visual Effects

### Q: Scene terlalu gelap, bisa diterangin?

**A:** Tambah intensitas ambient light di setiap scene:

```jsx
<ambientLight intensity={0.5} /> // Naikkan nilai ini
```

### Q: Efek blur terlalu kuat, bisa dikurangi?

**A:** Edit `DepthOfField` di post-processing:

```jsx
<DepthOfField
  focusDistance={0}
  focalLength={0.02}
  bokehScale={2}  // Kurangi nilai ini
/>
```

### Q: Partikel terlalu banyak dan lag, bisa dikurangi?

**A:** Edit count di setiap scene:

```jsx
// Scene1GiftBox.jsx
<Particles count={100} /> // Kurangi dari 150

// Scene6Celebration.jsx
{Array.from({ length: 50 })} // Kurangi dari 100
```

### Q: Bagaimana cara disable bloom effect?

**A:** Comment atau hapus `<Bloom>` component di `EffectComposer`:

```jsx
<EffectComposer>
  {/* <Bloom intensity={1.5} /> */}
  <DepthOfField ... />
</EffectComposer>
```

---

## 🐛 Troubleshooting

### Q: Layar hitam, tidak muncul apa-apa

**A:** Cek beberapa hal:

1. **Browser support WebGL?**
   ```
   Buka: https://get.webgl.org/
   Harus muncul spinning cube
   ```

2. **Console error?**
   ```
   F12 → Console tab
   Screenshot error dan search solusinya
   ```

3. **GPU driver up to date?**
   ```
   Update driver GPU Anda
   ```

4. **Try different browser**
   ```
   Chrome, Firefox, atau Edge terbaru
   ```

### Q: Error "Cannot find module"

**A:** 
```bash
# Delete node_modules dan install ulang
rm -rf node_modules
rm package-lock.json
npm install
```

### Q: Performance jelek / lag

**A:** Beberapa optimasi:

1. **Kurangi particle count** (lihat di atas)
2. **Disable heavy effects:**
   ```jsx
   // Comment ini di setiap scene:
   // <MotionBlur />
   // <ChromaticAberration />
   ```
3. **Lower resolution:**
   ```jsx
   <Canvas dpr={1}> // Default: window.devicePixelRatio
   ```
4. **Disable shadows:**
   ```jsx
   <Canvas shadows={false}>
   ```

### Q: Build error saat `npm run build`

**A:** 
```bash
# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Q: Deployed tapi blank page

**A:** Check:

1. **Base URL** di `vite.config.js`
   ```js
   base: '/repository-name/' // Untuk GitHub Pages
   ```

2. **Browser console** untuk error message

3. **Build output**
   ```bash
   # Pastikan dist/ folder ada dan berisi files
   ls -la dist/
   ```

---

## 🔊 Audio

### Q: Audio tidak keluar

**A:** Modern browsers butuh user interaction dulu:

```javascript
// Audio hanya play setelah user click/touch
// Ini sudah di-handle di code
```

### Q: Bisa ganti audio?

**A:** Ya! Edit `AudioManager.jsx`:

```jsx
// Ganti frequency & volume
playAmbientSound(
  frequency,  // 200-800 Hz
  volume,     // 0.01-0.1
  duration    // milliseconds
)
```

### Q: Bisa tambah background music?

**A:** Ya! Tambah di `AudioManager.jsx`:

```javascript
useEffect(() => {
  const audio = new Audio('/music/background.mp3')
  audio.loop = true
  audio.volume = 0.3
  audio.play()
  
  return () => {
    audio.pause()
    audio.currentTime = 0
  }
}, [])
```

---

## 📱 Mobile & Responsive

### Q: Apakah mobile-friendly?

**A:** Ya! Sudah responsive untuk:
- Desktop (optimal experience)
- Tablet (medium experience)
- Mobile (simplified experience)

### Q: Performance di mobile jelek

**A:** Mobile detection dan optimization:

```javascript
// Tambah di App.jsx
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

<Canvas
  dpr={isMobile ? 1 : window.devicePixelRatio}
  performance={{ min: 0.5 }}
>
```

### Q: Text terlalu kecil di mobile

**A:** Edit media query di `App.css`:

```css
@media (max-width: 768px) {
  .gift-text {
    font-size: 2rem; /* Naikkan ini */
  }
}
```

---

## 🌐 Deployment

### Q: Platform hosting mana yang terbaik?

**A:** Recommended order:
1. **Vercel** - Zero config, fastest
2. **Netlify** - Easy setup, great DX
3. **GitHub Pages** - Free, simple
4. **Cloudflare Pages** - Fast CDN

### Q: Bagaimana cara deploy ke Vercel?

**A:** 
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Atau connect GitHub repo di vercel.com

### Q: Apakah butuh environment variables?

**A:** Tidak, project ini tidak butuh env vars. Tapi jika ingin tambah (untuk analytics dll):

```bash
# .env.local
VITE_GA_ID=your-google-analytics-id
```

```jsx
// Gunakan di code:
const gaId = import.meta.env.VITE_GA_ID
```

### Q: Berapa cost untuk hosting?

**A:** 
- Vercel: **FREE** (Hobby plan)
- Netlify: **FREE** (Starter plan)
- GitHub Pages: **FREE**
- Cloudflare Pages: **FREE**

Semua sufficient untuk project ini!

---

## 🎓 Learning & Development

### Q: Saya pemula, dari mana mulai belajar?

**A:** Recommended learning path:

1. **React basics**
   - [React Official Docs](https://react.dev/)
   - [React Tutorial](https://react.dev/learn)

2. **Three.js fundamentals**
   - [Three.js Journey](https://threejs-journey.com/)
   - [Three.js Docs](https://threejs.org/docs/)

3. **React Three Fiber**
   - [R3F Docs](https://docs.pmnd.rs/react-three-fiber/)
   - [Poimandres YouTube](https://www.youtube.com/@poimandres-channel)

### Q: Bagaimana cara menambah scene baru?

**A:** 

1. **Buat component baru:**
   ```bash
   src/components/Scene7MyScene.jsx
   ```

2. **Implement scene:**
   ```jsx
   export default function Scene7MyScene({ onComplete }) {
     // Your 3D content here
     return (
       <>
         <mesh>...</mesh>
       </>
     )
   }
   ```

3. **Add to App.jsx:**
   ```jsx
   {currentScene === 7 && (
     <Scene7MyScene onComplete={handleMySceneComplete} />
   )}
   ```

### Q: Bisa pakai TypeScript?

**A:** Ya! Convert dengan:

```bash
# Install TypeScript
npm install -D typescript @types/react @types/react-dom @types/three

# Rename files
# .jsx → .tsx
# .js → .ts

# Add tsconfig.json
```

---

## 🔧 Advanced Topics

### Q: Bagaimana cara add custom shaders?

**A:** Gunakan `shaderMaterial`:

```jsx
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

const MyMaterial = shaderMaterial(
  { time: 0 },
  // vertex shader
  `...`,
  // fragment shader
  `...`
)

extend({ MyMaterial })

<mesh>
  <myMaterial time={time} />
</mesh>
```

### Q: Bisa integrasikan dengan backend API?

**A:** Ya! Contoh fetch data:

```javascript
useEffect(() => {
  fetch('https://api.example.com/birthday-data')
    .then(res => res.json())
    .then(data => {
      // Use data in scenes
      setUserData(data)
    })
}, [])
```

### Q: Bagaimana cara add analytics?

**A:** 

```javascript
// Install analytics library
npm install react-ga4

// In App.jsx
import ReactGA from 'react-ga4'

useEffect(() => {
  ReactGA.initialize('G-XXXXXXXXXX')
  ReactGA.send('pageview')
}, [])

// Track scene transitions
const handleSceneChange = (scene) => {
  ReactGA.event({
    category: 'Navigation',
    action: 'Scene Change',
    label: `Scene ${scene}`
  })
}
```

---

## 💡 Tips & Tricks

### Q: Tips untuk smooth animations?

**A:** 

1. **Use requestAnimationFrame** (handled by useFrame)
2. **Lerp for smooth transitions:**
   ```javascript
   mesh.position.lerp(targetPosition, 0.1)
   ```
3. **GSAP ease functions:**
   ```javascript
   ease: 'power2.inOut'
   ```

### Q: Cara optimize load time?

**A:** 

1. **Lazy load scenes:**
   ```javascript
   const Scene3 = lazy(() => import('./Scene3'))
   ```

2. **Compress textures**
3. **Use texture atlases**
4. **Code splitting** (sudah di-setup di vite.config)

### Q: Best practices untuk Three.js?

**A:** 

1. **Dispose geometry & materials:**
   ```javascript
   useEffect(() => {
     return () => {
       geometry.dispose()
       material.dispose()
     }
   }, [])
   ```

2. **Reuse geometries & materials**
3. **Use instancing for many objects**
4. **Limit draw calls**
5. **Profile with Stats**

---

## 🆘 Need More Help?

- 📖 **Documentation**: Check README.md, TECHNICAL.md
- 🐛 **Issues**: Open GitHub issue
- 💬 **Community**: Join Three.js Discord
- 📺 **Videos**: Watch tutorials on YouTube

---

## 📝 Feature Requests

### Q: Bisa request fitur baru?

**A:** Ya! Open issue di GitHub dengan:
- Clear description
- Use case
- Expected behavior
- Mockup (optional)

---

**Happy Building!** 🚀✨

Jika pertanyaan Anda belum terjawab, feel free to open an issue atau contact maintainer!
