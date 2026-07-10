# 🏛️ SIGAP (Sistem Informasi Gerak Aduan Publik)

<p align="center">
  <img src="assets/images/sigap.png" alt="SIGAP Logo" width="120" height="120" style="border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 20px;" />
</p>

<p align="center">
  <b>Layanan Aspirasi & Pengaduan Infrastruktur Daerah Terintegrasi</b>
</p>

<p align="center">
  🌐 <b>Website Live:</b> <a href="https://sigap-liard.vercel.app">sigap-liard.vercel.app</a>
</p>

---

**SIGAP** adalah platform digital pelayanan aspirasi dan pengaduan infrastruktur daerah terintegrasi. Platform ini dirancang untuk memangkas birokrasi dan menjembatani komunikasi antara masyarakat umum dan instansi pemerintah daerah terkait (seperti Dinas Pekerjaan Umum dan Penataan Ruang/PUPR, Dinas Perhubungan, dll.) dalam melaporkan serta menyelesaikan kendala fasilitas publik (jalan berlubang, lampu penerangan padam, saluran drainase tersumbat, dll.).

---

## 🚀 Fitur Utama & Pembaruan Sistem

1.  **Autentikasi Hybrid & Google Sign-In (Supabase Auth)**
    *   **Google OAuth Integration**: Warga/Masyarakat kini dapat masuk secara instan menggunakan Akun Google melalui Supabase Auth.
    *   **Pencegahan Re-Login Loop**: Dilengkapi sistem *state flags* khusus untuk mendeteksi aksi keluar sesi (*intentional sign-out*) guna menghindari masuk otomatis kembali saat memuat ulang halaman browser (*page refresh*).
    *   **Auto-Redirect Instan**: Proses parsing token Google berjalan cepat (dengan mitigasi race condition pada client load) untuk pengalihan instan langsung ke dashboard.

2.  **Sinkronisasi Database Hybrid (localStorage & Supabase SQL)**
    *   **Direct-to-Cloud Sync**: Data aduan, aduan logs, status aduan, dan data pengguna disinkronkan secara otomatis dan real-time dari *local storage* browser ke tabel SQL Supabase.
    *   **Offline-First Resilience**: Jika koneksi terputus, aplikasi tetap berfungsi menggunakan database lokal dan akan menyelaraskan data saat kembali online.

3.  **Auto-Geocoding Alamat Jalan (OpenStreetMap Nominatim API)**
    *   **Pencarian Lokasi Instan**: Saat menuliskan nama jalan pada formulir pengaduan, sistem secara otomatis menerjemahkan alamat teks tersebut menjadi koordinat latitude & longitude presisi.
    *   **Debounced Fetching**: Proses geocoding dilengkapi dengan delay *debounce* 800ms untuk mencegah spam request API.
    *   **Auto Map Focus**: Peta Leaflet akan bergeser (*panning*) secara otomatis dan mengunci marker merah tepat pada jalan/lokasi kerusakan yang terdeteksi.

4.  **Optimasi Responsivitas & UI/UX Perangkat Mobile**
    *   **Bebas Scroll Lock (Map Scroll Trap Fix)**: Geser peta satu jari dinonaktifkan khusus pada browser ponsel sentuh. Pengguna bebas men-scroll formulir panjang tanpa takut tersangkut atau layarnya terkunci pada peta Leaflet.
    *   **Inertial momentum scroll**: Menambahkan dukungan akselerasi geser tabel yang mulus bagi pengguna iOS/Safari Mobile.
    *   **Responsive Typography & Contrast**: Tata letak judul hero utama berskala dinamis dan warna navigasi aktif mobile ditingkatkan kontrasnya (`text-white font-bold`) agar nyaman dibaca.

5.  **Log Riwayat Aduan Komprehensif (Audit Trail / Linimasa)**
    *   Setiap aduan memiliki linimasa (*timeline*) riwayat log yang transparan dan terperinci, mulai dari pengiriman laporan, disposisi ke dinas terkait, hingga status pengerjaan dinyatakan selesai oleh petugas di lapangan.

---

## 🛠️ Tech Stack & Arsitektur

Platform SIGAP dibangun menggunakan arsitektur modern berbasis client-side dengan integrasi database cloud:

### 🎨 Frontend & Styling
*   ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) — Kerangka struktur web semantik & SEO.
*   ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) — Tata gaya kustom dan animasi transisi.
*   ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) — Utilitas tata letak responsif & mobile-first.
*   ![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black) — Logika mesin utama (ES6+).

### 🗺️ Geospatial & Maps
*   ![LeafletJS](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white) — Rendering peta spasial interaktif.
*   ![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white) — Penyedia peta dasar dunia & Nominatim Geocoding API.

### ☁️ Backend & Database Services
*   ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) — Cloud Database PostgreSQL & Autentikasi Google OAuth.
*   ![Web Storage API](https://img.shields.io/badge/LocalStorage-blue?style=for-the-badge&logo=google-chrome&logoColor=white) — Penyimpanan cache lokal persisten di browser.

### 🚀 Tools & Deployment
*   ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white) — Web hosting serverless deployment.
*   ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) — Sistem kontrol versi kode.
*   ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) — Repositori hosting kode.

---

## 📂 Struktur Proyek

```bash
├── assets/
│   ├── css/
│   │   └── style.css            # Kustomisasi CSS tambahan & animasi transisi
│   ├── images/                  # Aset gambar dan ikon kategori laporan
│   └── js/
│       └── script.js            # Core engine: database lokal, validasi sesi, & render profil
├── prisma/                      # Folder Prisma ORM
├── index.html                   # Beranda & Landing Page utama SIGAP
├── login.html                   # Portal masuk khusus Administrator & Petugas
├── login-masyarakat.html        # Portal masuk khusus Masyarakat/Pelapor
├── register.html                # Halaman pendaftaran akun Warga baru
├── dashboard-pelapor.html       # Dasbor utama bagi Masyarakat/Pelapor
├── buat-laporan.html            # Formulir pengaduan aduan baru dengan penanda peta GPS interaktif
├── detail-laporan-pelapor.html  # Detil & linimasa penanganan laporan untuk Pelapor
├── pengaturan-profil-pelapor.html # Pengaturan profil, informasi pribadi & kata sandi Pelapor
├── sigap.html                   # Dasbor utama bagi Administrator Pemda
├── laporan.html                 # Rekapitulasi aduan aduan tabel & formulir disposisi bagi Admin
├── detail-laporan.html          # Detil tinjauan aduan, peta detail, & form status bagi Admin
├── peta.html                    # Peta spasial sebaran titik aduan untuk Administrator
├── peta-pelapor.html            # Peta spasial sebaran titik aduan untuk Masyarakat
├── manajemen-user.html          # Manajemen katalog & kontrol status pengguna (Aktif/Blokir) oleh Admin
└── pengaturan-profil.html       # Pengaturan profil & keamanan sandi Administrator/Petugas
```

---

## ⚙️ Petunjuk Pemasangan Lokal

1.  **Klon Repositori**:
    ```bash
    git clone https://github.com/Revaldi-lang/SIGAP.git
    ```
2.  **Jalankan Lokal Server**:
    Aplikasi ini dibangun menggunakan arsitektur statis murni (*No Build Tools*). Anda dapat menjalankannya langsung di browser Anda dengan mengeklik berkas `index.html` atau menggunakan ektensi **Live Server** di VS Code.

---

## 🌐 Deployment Vercel

### Konfigurasi Clean URLs (`vercel.json`)
Untuk menghilangkan ekstensi `.html` dari bilah alamat URL peramban di Vercel, pastikan berkas `vercel.json` dibuat di direktori utama dengan konfigurasi berikut:
```json
{
  "cleanUrls": true
}
```

---

### 📝 Catatan Hak Cipta
*SIGAP - Sistem Informasi Gerak Aduan Publik © 2026. Dikembangkan untuk mempercepat pembangunan infrastruktur nasional yang merata.*
