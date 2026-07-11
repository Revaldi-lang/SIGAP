# 🛡️ SIGAP - Sistem Informasi Gerak Aduan Publik

**SIGAP** adalah platform pelayanan pengaduan dan aspirasi infrastruktur publik terintegrasi yang dirancang untuk mempercepat koordinasi antara masyarakat umum dan instansi pemerintah daerah. Dengan antarmuka yang modern, responsif, dan intuitif, SIGAP mendigitalisasi alur pelaporan fisik menjadi sistem pemantauan real-time yang transparan.

---

## 🌐 Live Demo (Vercel)

Aplikasi SIGAP telah dideploy dan dapat diakses secara online melalui Vercel pada tautan berikut:
👉 **[https://sigap-next.vercel.app](https://sigap-next.vercel.app)** *(silakan sesuaikan dengan domain Vercel Anda)*

---

## ⚡ Tech Stack Utama

SIGAP dibangun menggunakan arsitektur modern berkinerja tinggi:

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)

- **Framework Utama:** React / Next.js 14+ (App Router)
- **Bahasa Pemrograman:** TypeScript (Keamanan Tipe Data & Auto-complete)
- **Styling Engine:** Tailwind CSS v4 (Desain Utility-first Responsif)
- **Backend-as-a-Service (BaaS):** Supabase (Otentikasi, Database PostgreSQL, dan Real-time Subscriptions)
- **Peta Spasial (Web-GIS):** Leaflet & React Leaflet (Visualisasi Koordinat Geografis)

---

## 📁 Struktur Direktori Proyek

Platform ini menerapkan standar penataan folder Next.js App Router yang bersih dan modular:

```text
SIGAP/
├── legacy-html/                 # 📂 Arsip cadangan berkas HTML/JS/CSS statis lama
├── public/                      # 📂 Aset gambar publik statis (Logo, Foto Kategori)
│   └── assets/images/
├── src/
│   ├── app/                     # 📂 Folder Routing Next.js (App Router)
│   │   ├── admin/               #   ├── Dasbor Aparatur Pemda & Manajemen Laporan
│   │   │   ├── detail-laporan/  #   │   └── Detail peninjauan, disposisi, & validasi
│   │   │   ├── laporan/         #   │   └── Tabel filter pencarian laporan
│   │   │   ├── manajemen-user/  #   │   └── Kontrol akses & pemblokiran user
│   │   │   ├── pengaturan-profil#   │   └── Profil satker dinas
│   │   │   └── peta/            #   │   └── Peta spasial monitoring aduan
│   │   ├── buat-laporan/        #   ├── Form buat aduan warga (Leaflet Map Selector)
│   │   ├── dashboard-pelapor/   #   ├── Halaman utama dasbor warga
│   │   ├── detail-laporan-pelapor/# Halaman pelacakan linimasa aduan pelapor
│   │   ├── login/               #   ├── Portal masuk admin
│   │   ├── login-masyarakat/    #   ├── Portal masuk warga (Google OAuth)
│   │   ├── pengaturan-profil-pelapor/# Pengaturan biodata & sandi warga
│   │   ├── peta-pelapor/        #   ├── Peta dampak spasial warga se-kota
│   │   ├── register/            #   ├── Pendaftaran warga baru
│   │   ├── globals.css          #   └── CSS global & tema Tailwind CSS v4
│   │   └── layout.tsx           #   └── Wrapper layout utama & provider konteks
│   ├── components/              # 📂 Komponen UI Reusable
│   │   ├── AuthGuard.tsx        #   ├── Pelindung rute login & hak akses
│   │   ├── Footer.tsx           #   ├── Footer informasi bantuan
│   │   ├── MapDetailView.tsx    #   ├── Peta detail aduan (Readonly)
│   │   ├── MapImpactView.tsx    #   ├── Peta sebaran se-kota (Colored Pins)
│   │   ├── MapSelector.tsx      #   ├── Peta selektor koordinat aduan
│   │   ├── ModalAkses.tsx       #   ├── Modal pemilih rute login
│   │   ├── Navbar.tsx           #   ├── Navigasi dinas & profile dropdown
│   │   ├── SessionTimeoutHandler.tsx # Pemicu modal keluar otomatis sesi tidak aktif
│   │   └── Sidebar.tsx          #   └── Panel menu navigasi samping
│   ├── context/
│   │   └── AppContext.tsx       # 📂 Global State Management (Supabase SDK sync)
│   └── lib/
│       └── supabase.ts          # 📂 Inisialisasi client koneksi Supabase
├── .env.local                   # 🔐 Variabel lingkungan lokal (Supabase Keys)
├── next.config.ts               # ⚙️ Konfigurasi framework Next.js
├── package.json                 # ⚙️ Dependensi proyek & NPM scripts
├── tsconfig.json                # ⚙️ Konfigurasi compiler TypeScript
└── README.md                    # 📝 Informasi berkas petunjuk ini
```

---

## 🚀 Panduan Membuka & Menjalankan Web Secara Lokal

Ikuti langkah-langkah di bawah ini untuk memasang dependensi dan menjalankan server pengembangan SIGAP di komputer Anda:

### 1. Prasyarat Sistem
Pastikan Anda sudah menginstal:
*   [Node.js](https://nodejs.org/) (Versi LTS terbaru, disarankan v18 ke atas)
*   [Git](https://git-scm.com/)

### 2. Kloning Repositori
Buka terminal/command prompt, lalu jalankan perintah berikut:
```bash
git clone https://github.com/Revaldi-lang/SIGAP.git
cd SIGAP
```

### 3. Pasang Dependensi Node Modules
Unduh dan pasang seluruh pustaka dependensi yang dibutuhkan proyek:
```bash
npm install
```

### 4. Konfigurasi Variabel Lingkungan (.env)
Buat berkas bernama `.env.local` di direktori utama (root folder) proyek, lalu masukkan URL dan Anon Key dari proyek Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://alamat-proyek-supabase-anda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnd2V4amVjeXRqZXN...
```

### 5. Jalankan Server Pengembangan
Nyalakan server lokal Next.js untuk memulai proses pengembangan interaktif:
```bash
npm run dev
```
Setelah server menyala, buka tautan berikut di browser Anda:
👉 **[http://localhost:3000](http://localhost:3000)**

### 6. Membuat Build Produksi
Untuk menguji hasil kompilasi produksi yang teroptimasi, jalankan perintah:
```bash
npm run build
npm run start
```
Perintah ini akan melakukan pengecekan sintaks TypeScript/ESLint secara ketat dan melakukan prerendering halaman statis.

---

## ☁️ Panduan Deploy ke Vercel

Untuk menjalankan web ini di server cloud Vercel secara otomatis dari repositori GitHub Anda:

1. **Hubungkan Repositori:** Hubungkan repositori GitHub **Revaldi-lang/SIGAP** ke akun Vercel Anda.
2. **Atur Environment Variables:** Daftarkan variabel lingkungan database Supabase Anda pada panel **Project Settings -> Environment Variables** di Vercel:
   *   `NEXT_PUBLIC_SUPABASE_URL` = *(URL Supabase Anda)*
   *   `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *(Anon Key Supabase Anda)*
3. **Pilih Framework Preset:** Vercel akan otomatis mendeteksi proyek Next.js Anda. Pastikan **Framework Preset** terkonfigurasi ke **Next.js**.
4. **Deploy:** Lakukan redeploy atau push commit terbaru untuk memulai kompilasi serverless Next.js secara otomatis.

---

## 🔒 Fitur Keamanan Keanggotaan & Hak Akses
1.  **Masyarakat / Pelapor:** Akun dengan peran ini dapat membuat laporan, mengunggah foto kerusakan, dan melacak status progresnya. Akun warga didaftarkan lewat portal register atau masuk instan dengan Google OAuth.
2.  **Administrator:** Akun dengan peran ini memiliki panel khusus untuk meninjau seluruh laporan, mengelola pengguna (blokir/hapus), serta mendelegasikan (disposisi) laporan ke instansi dinas teknis daerah terkait.
