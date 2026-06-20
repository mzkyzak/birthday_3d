# 🎉 3D Birthday Experience - Taufiq Ikhsan Muzaky

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/ThreeJs-black?style=for-the-badge&logo=three.js&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

Sebuah pengalaman website interaktif 3D yang dibuat secara khusus untuk merayakan ulang tahun ke-18. Proyek ini menggabungkan animasi kompleks, rendering 3D, dan transisi sinematik untuk memberikan pengalaman visual kelas atas (Awwwards-tier).

## ✨ Fitur Utama

- **Premium 3D Rendering**: Objek kado 3D interaktif dengan efek anti-gravitasi dan orbit mouse.
- **Cinematic Transitions**: Efek transisi tingkat lanjut menggunakan partikel api, jejak cahaya (light trails), dan animasi portal 3D.
- **Holographic UI & Parallax**: Kartu memori dan proyek dengan efek tilt 3D holografis, dihiasi dengan latar belakang kosmik dan hujan meteor.
- **Fluid Animations**: Animasi halus dengan 60 FPS yang dikontrol menggunakan kombinasi Framer Motion dan GSAP.
- **Custom Cursor**: Kursor kustom yang reaktif terhadap elemen antarmuka.
- **FPS Meter**: Pelacak performa bawaan untuk memastikan animasi berjalan lancar.

## 📂 Struktur Komponen (`src/components`)

Proyek ini dibagi menjadi beberapa *scene* utama untuk menciptakan alur cerita (storytelling) yang imersif:

1. **`Scene1Gift.jsx` (Premium Anti-Gravity Gift)**
   Menampilkan kado 3D interaktif yang melayang dengan efek pencahayaan dinamis. Komponen ini bereaksi terhadap pergerakan kursor pengguna (*Mouse Orbit*).
   
2. **`PortalCinematic.jsx`**
   Komponen efek partikel dan bintang yang menciptakan transisi sinematik bergaya portal dimensi.

3. **`Scene3Birthday.jsx` (The Birthday Card)**
   Menampilkan profil, hitungan usia (18 tahun), dan efek teks gradien animasi untuk menyambut momen ulang tahun.

4. **`Scene4Photos.jsx` (Memories & Projects)**
   Menampilkan galeri perjalanan, memori, dan portofolio proyek. Dilengkapi dengan *Parallax Stars*, *Holographic Hover*, dan *3D Matrix Reveal*.

5. **`Scene5Conclusion.jsx` (The Conclusion & Story)**
   Scene penutup yang berisi pesan mendalam, rasa syukur atas pencapaian di bidang Rekayasa Perangkat Lunak (RPL), dan harapan di usia yang baru.

6. **`TransitionOverlay.jsx`**
   Sistem partikel berbasis HTML Canvas yang mengatur efek transisi antar scene secara mulus (flash, fire, dan light streaks).

7. **`CustomCursor.jsx`**
   Menggantikan kursor bawaan browser dengan kursor kustom berbasis React yang menyatu dengan tema website.

## 🚀 Teknologi yang Digunakan

- **React.js** (Vite)
- **@react-three/fiber & @react-three/drei** (Web-based 3D rendering)
- **Framer Motion** (Deklaratif UI Animation)
- **GSAP** (Animasi transisi kompleks tingkat tinggi)
- **Vanilla CSS** (Penataan gaya modern dan interaktif)

## 🛠️ Cara Menjalankan Proyek (Local Development)

1. Clone repositori ini:
   ```bash
   git clone https://github.com/username-kamu/nama-repo.git
   ```
2. Masuk ke dalam direktori proyek:
   ```bash
   cd nama-repo
   ```
3. Install dependensi:
   ```bash
   npm install
   ```
4. Jalankan *development server*:
   ```bash
   npm run dev
   ```

## 👨‍💻 Tentang Pengembang

Dibuat oleh **Taufiq Ikhsan Muzaky** (@mzkyzak) – Seorang siswa Rekayasa Perangkat Lunak (RPL) yang bersemangat dalam mempelajari teknologi web modern dan membangun antarmuka interaktif yang memukau.

---

*“Konsistensi dalam belajar adalah kunci menuju pemahaman yang mendalam.”*
