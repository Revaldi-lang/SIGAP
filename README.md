# 🛡️ SIGAP - Sistem Informasi Gerak Aduan Publik

**SIGAP** adalah platform pelayanan pengaduan dan aspirasi infrastruktur publik terintegrasi yang dirancang untuk mempercepat koordinasi antara masyarakat umum dan instansi pemerintah daerah. Dengan antarmuka yang modern, responsif, dan intuitif, SIGAP mendigitalisasi alur pelaporan fisik menjadi sistem pemantauan real-time yang transparan.

---

## 🌐 Live Demo (Vercel)

Aplikasi SIGAP telah dideploy dan dapat diakses secara online melalui Vercel pada tautan berikut:
👉 **[https://sigap-liard.vercel.app/](https://sigap-liard.vercel.app/)**

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

## ✨ Fitur-Fitur Utama Platform SIGAP

SIGAP dilengkapi dengan berbagai fitur modern berbasis spasial untuk mempermudah pelaporan dan pemantauan infrastruktur kota secara transparan:

### 1. Pelaporan Aduan Infrastruktur (Masyarakat)
* **Formulir Laporan Intuitif**: Warga dapat mengirimkan aduan mengenai infrastruktur publik (Jalan, Pipa Air/Drainase, Penerangan Jalan/PJU, Jembatan, dll.).
* **Unggah Foto Kerusakan**: Mendukung pengunggahan bukti visual foto kerusakan fisik di lapangan.
* **Peta Selektor Geografis (Map Selector)**: Menentukan lokasi koordinat (latitude & longitude) titik kerusakan secara presisi menggunakan peta interaktif Leaflet.

### 2. Sistem Web-GIS / Peta Spasial Interaktif
* **Peta Sebaran Kota (Map Impact View)**: Visualisasi peta kota dengan pin penanda berwarna yang dikelompokkan berdasarkan kategori aduan untuk memetakan titik-titik rawan secara spasial.
* **Peta Detail Aduan**: Menampilkan penanda lokasi presisi satu laporan aduan tertentu pada halaman detail laporan.

### 3. Pelacakan Progres & Transparansi Real-Time
* **Linimasa Alur Aduan**: Pelapor dapat melacak tahapan laporan mereka, mulai dari status **Diajukan**, **Diproses**, hingga **Selesai**.
* **Persentase Progres Fisik**: Menampilkan tingkat kemajuan pengerjaan fisik di lapangan yang dilaporkan oleh petugas dinas secara berkala.

### 4. Dasbor Administrasi Aparatur Pemda (Admin)
* **Manajemen & Verifikasi Laporan**: Panel khusus admin untuk memvalidasi aduan masuk guna menghindari laporan palsu/duplikat.
* **Disposisi & Delegasi**: Mengarahkan penanganan laporan kepada satuan kerja dinas terkait (seperti Dinas PUPR atau Dinas Perhubungan) secara digital.

### 5. Manajemen Pengguna & Keanggotaan (Admin)
* **Kontrol Akses Pengguna**: Manajemen data akun pelapor dan petugas.
* **Tindakan Keamanan**: Administrator dapat meninjau keaktifan akun, melakukan pemblokiran (suspend), atau menghapus akun pengguna secara permanen.

### 6. Autentikasi & Keamanan Sesi
* **Role-Based Access Control (RBAC)**: Pembatasan hak akses halaman yang ketat antara akun Warga/Pelapor dan Admin/Aparatur Pemda melalui `AuthGuard`.
* **Session Timeout Handler**: Perlindungan keamanan yang otomatis mendeteksi ketiadaan aktivitas pengguna dan mengeluarkan sesi login secara otomatis (auto-logout) untuk mencegah penyalahgunaan akun.


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
