# 🚀 Deployment Guide

Panduan lengkap untuk deploy aplikasi Birthday 3D Experience ke berbagai platform hosting.

## 📋 Preparation

Sebelum deploy, pastikan:

1. Project sudah di-build tanpa error:
```bash
npm run build
```

2. Test production build locally:
```bash
npm run preview
```

3. Pastikan semua dependencies sudah terinstall dengan benar

---

## 🌐 Deploy ke Vercel (Recommended)

Vercel adalah platform yang sangat cocok untuk React + Vite projects.

### Method 1: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Method 2: Via GitHub Integration

1. Push project ke GitHub repository
2. Buka [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import repository dari GitHub
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

**Custom Domain:**
- Setelah deploy, bisa add custom domain di Project Settings

---

## 🎯 Deploy ke Netlify

### Method 1: Drag & Drop

```bash
# Build project
npm run build

# Drag folder 'dist' ke Netlify Drop
```

### Method 2: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Method 3: Via GitHub Integration

1. Push ke GitHub
2. Buka [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy"

**netlify.toml** configuration:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🔷 Deploy ke GitHub Pages

### Setup

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/birthday-3d",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.js`:
```js
export default defineConfig({
  plugins: [react()],
  base: '/birthday-3d/'
})
```

### Deploy

```bash
npm run deploy
```

Site akan tersedia di: `https://yourusername.github.io/birthday-3d`

---

## ☁️ Deploy ke Cloudflare Pages

### Via Dashboard

1. Build project:
```bash
npm run build
```

2. Buka [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Go to "Pages" → "Create a project"
4. Upload `dist` folder

### Via Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages publish dist
```

### Via Git Integration

1. Push ke GitHub/GitLab
2. Connect repository di Cloudflare Pages
3. Configure:
   - **Build command**: `npm run build`
   - **Build output**: `dist`
   - **Node version**: 18

---

## 🐳 Deploy dengan Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Build & Run

```bash
# Build image
docker build -t birthday-3d .

# Run container
docker run -p 8080:80 birthday-3d
```

---

## 🌟 Deploy ke Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Configure:
# - Public directory: dist
# - Single-page app: Yes
# - GitHub integration: Optional

# Build
npm run build

# Deploy
firebase deploy
```

---

## ⚡ Deploy ke AWS S3 + CloudFront

### 1. Build Project

```bash
npm run build
```

### 2. Create S3 Bucket

```bash
aws s3 mb s3://birthday-3d-bucket
aws s3 website s3://birthday-3d-bucket --index-document index.html
```

### 3. Upload Files

```bash
aws s3 sync dist/ s3://birthday-3d-bucket --acl public-read
```

### 4. Setup CloudFront (Optional, untuk CDN)

- Create CloudFront distribution
- Origin: S3 bucket
- Enable HTTPS
- Configure custom domain

---

## 🔧 Performance Optimization untuk Production

### 1. Vite Config Optimization

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'animation-vendor': ['gsap', 'framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 2. Enable Compression

Tambahkan di hosting config untuk enable Gzip/Brotli compression:
- Text files: HTML, CSS, JS
- SVG dan JSON

### 3. Cache Headers

Set cache headers untuk static assets:
```
# Vite hashed assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# HTML
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

---

## 📊 Post-Deployment Checklist

- [ ] Test di multiple browsers (Chrome, Firefox, Safari)
- [ ] Test di mobile devices
- [ ] Check console untuk errors
- [ ] Verify 3D rendering works correctly
- [ ] Test all 6 scenes transitions
- [ ] Check loading performance (Lighthouse score)
- [ ] Verify custom domain (jika ada)
- [ ] Setup SSL/HTTPS
- [ ] Configure analytics (optional)

---

## 🛡️ Security Headers (Recommended)

Tambahkan security headers di hosting config:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 📈 Analytics Integration (Optional)

### Google Analytics

```html
<!-- Tambahkan di index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🐛 Troubleshooting Deployment

### Issue: Blank page after deployment

**Solution:**
1. Check base URL di `vite.config.js`
2. Verify build output di folder `dist`
3. Check browser console untuk errors

### Issue: 3D tidak render

**Solution:**
1. Pastikan WebGL support di browser
2. Check Three.js errors di console
3. Verify all assets loaded correctly

### Issue: Slow loading

**Solution:**
1. Enable compression di hosting
2. Use CDN (CloudFront, Cloudflare)
3. Optimize chunk splitting
4. Enable caching headers

---

## 🎉 Success!

Aplikasi Birthday 3D Experience Anda sudah online! 🚀

Share link-nya dan biarkan magic happen! ✨

---

**Need Help?** Check the main README.md atau buka issue di repository.
