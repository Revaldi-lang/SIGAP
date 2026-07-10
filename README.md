# 🏛️ SIGAP (Sistem Informasi Gerak Aduan Publik)

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet JS](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)

**SIGAP** adalah platform digital pelayanan aspirasi dan pengaduan infrastruktur daerah terintegrasi. Platform ini dirancang untuk memangkas birokrasi dan menjembatani komunikasi antara masyarakat umum dan instansi pemerintah daerah terkait (seperti Dinas Pekerjaan Umum dan Penataan Ruang/PUPR, Dinas Perhubungan, dll.) dalam melaporkan serta menyelesaikan kendala fasilitas publik (jalan berlubang, lampu penerangan padam, saluran drainase tersumbat, dll.).

Platform ini mengusung pendekatan modern **Aesthetics & Visual Excellence** dengan dominansi skema warna *warm cream* minimalis yang teduh dan aksen *royal blue* yang premium, interaktif, serta responsif sepenuhnya untuk perangkat mobile maupun desktop.

---

## 🚀 Fitur Utama

1. **Sistem Sesi Dinamis & Profil Sinkron (Landing Page Sync)**
   - **Dynamic Navbar**: Tombol "Masuk Portal" di navigasi atas otomatis berubah menjadi avatar inisial nama pelapor beserta menu dropdown interaktif (Dasbor, Profil, Keluar Sesi) setelah berhasil masuk.
   - **Inactivity Timeout (Sesi Otomatis Berakhir)**: Sesi pengguna akan otomatis kedaluwarsa setelah 30 menit tidak ada aktivitas guna menjaga keamanan data. Dilengkapi modal peringatan interaktif 60 detik sebelum sesi benar-benar berakhir.
   - **Role Guard & Route Protection**: Mencegah akses halaman ilegal (misal: Pelapor mengakses halaman Admin atau sebaliknya) dengan pengalihan otomatis (*auto-redirect*) berbasis sistem sesi.

2. **Mitigasi Keamanan & Validasi Input (Security & XSS Mitigation)**
   - Dilengkapi *utility* pembersihan input (`sanitizeInput` & `escapeHTML`) untuk memitigasi serangan Cross-Site Scripting (XSS) sebelum data aduan atau profil disimpan ke database lokal.

3. **Dasbor Multi-Role Terintegrasi**
   - **Portal Masyarakat (Pelapor)**:
     - Mengirimkan aduan infrastruktur baru secara dinamis lengkap dengan pengunggahan foto simulasi dan penentuan koordinat peta presisi.
     - Melihat status pengerjaan laporan secara real-time dan mengelola data profil serta kata sandi.
   - **Portal Administrator & Petugas**:
     - Rekapitulasi data statistik aduan (jumlah total, laporan baru, diproses, dan selesai) secara visual.
     - Manajemen tabel aduan dengan filter status/kategori, penentuan disposisi petugas lapangan, dan pembaharuan status pengerjaan laporan.
     - Manajemen katalog pengguna (Warga, Admin, Petugas) secara dinamis (mengubah status aktif/blokir akun).

4. **Integrasi Peta Spasial Dampak (LeafletJS Web-GIS)**
   - **Visualisasi Geografis**: Pemetaan titik lokasi kerusakan fasilitas daerah secara real-time berbasis Web-GIS menggunakan LeafletJS untuk mempermudah visualisasi prioritas perbaikan oleh kedinasan.
   - **Peta Khusus Admin & Warga**: Terbagi menjadi peta spasial umum bagi warga dan peta disposisi analitis bagi administrator.

5. **Log Riwayat Aduan Komprehensif (Audit Trail / Timeline)**
   - Setiap aduan memiliki linimasa (*timeline*) riwayat log yang transparan dan terperinci, mulai dari pengiriman laporan, disposisi ke dinas terkait, hingga status pengerjaan dinyatakan selesai oleh petugas di lapangan.

6. **Database Lokal Terkoneksi Instan (localStorage Database Engine)**
   - Seluruh data akun, laporan aduan, riwayat log, dan foto simulasi tersimpan secara persisten pada `localStorage` browser.
   - Dilengkapi dengan *Mock Data Generator* otomatis saat pertama kali dikunjungi untuk mempermudah proses demonstrasi dan pengujian sistem.

---

## 🛠️ Tech Stack & Arsitektur

Platform SIGAP dibangun menggunakan teknologi statis murni (*client-side*) yang berjalan sepenuhnya di sisi browser:

*   **Markup**: HTML5 dengan struktur elemen semantik untuk optimasi SEO dan aksesibilitas.
*   **Styling & UI**: 
    - **Tailwind CSS v3 (CDN)**: Digunakan untuk tata letak responsif dan utilitas gaya yang konsisten, lengkap dengan plugin `@tailwindcss/forms` dan `@tailwindcss/container-queries`.
    - **Vanilla CSS**: Digunakan untuk gaya kustom tambahan dan transisi animasi halus pada [style.css](file:///c:/Users/user/OneDrive/Desktop/SIGAP/assets/css/style.css).
*   **Ikonografi & Tipografi**:
    - **FontAwesome Icons v6** & **Material Symbols Outlined**: Untuk penyediaan simbol navigasi, tombol, dan visualisasi aksi.
    - **Google Fonts (Plus Jakarta Sans)**: Font utama untuk memberikan kesan premium, modern, dan keterbacaan yang tinggi.
*   **Javascript Engine**: Vanilla JS (ES6+) murni tanpa *framework* berat (React/Vue), memastikan waktu muat (*load time*) yang instan dan interaksi yang gegas.
*   **Maps & GIS**: **LeafletJS API** (CSS & JS CDN) untuk rendering peta spasial interaktif, penandaan lokasi koordinat GPS, dan peta sebaran aduan.
*   **Database & Sesi**: Web Storage API (**localStorage**) untuk persistensi data laporan, akun pengguna, logs riwayat, sesi aktif, serta sinkronisasi dinamis antardasbor secara lokal.

---

## 📂 Struktur Proyek

```bash
├── assets/
│   ├── css/
│   │   └── style.css            # Kustomisasi CSS tambahan & animasi transisi
│   ├── images/                  # Aset gambar dan ikon kategori laporan
│   │   ├── jalanrusak.jpg
│   │   ├── kategori_drainase.jpg
│   │   ├── kategori_fasilitas.jpg
│   │   ├── kategori_jalan.jpg
│   │   ├── kategori_lainnya.jpg
│   │   ├── kategori_penerangan.jpg
│   │   └── sigap.png            # Logo utama aplikasi SIGAP
│   └── js/
│       └── script.js            # Core engine: database lokal, validasi sesi, & render profil
├── prisma/                      # Folder Prisma ORM (dicadangkan untuk pengembangan backend masa depan)
├── index.html                   # Beranda & Landing Page utama SIGAP
├── login.html                   # Portal masuk khusus Administrator & Petugas
├── login-masyarakat.html        # Portal masuk khusus Masyarakat/Pelapor
├── register.html                # Halaman pendaftaran akun Warga baru
├── dashboard-pelapor.html       # Dasbor utama bagi Masyarakat/Pelapor
├── buat-laporan.html            # Formulir pengaduan baru dengan penanda peta GPS interaktif
├── detail-laporan-pelapor.html  # Detil & linimasa penanganan laporan untuk Pelapor
├── pengaturan-profil-pelapor.html # Pengaturan profil, informasi pribadi & kata sandi Pelapor
├── sigap.html                   # Dasbor utama bagi Administrator Pemda
├── laporan.html                 # Rekapitulasi tabel aduan & formulir disposisi bagi Admin
├── detail-laporan.html          # Detil tinjauan aduan, peta detail, & form status bagi Admin
├── peta.html                    # Peta spasial sebaran titik aduan untuk Administrator
├── peta-pelapor.html            # Peta spasial sebaran titik aduan untuk Masyarakat
├── manajemen-user.html          # Manajemen katalog & kontrol status pengguna (Aktif/Blokir) oleh Admin
└── pengaturan-profil.html       # Pengaturan profil & keamanan sandi Administrator/Petugas
```

---
---

## 🔑 Akun Uji Coba Default

Aplikasi ini dilengkapi dengan data simulasi awal (*mock data*) yang disimpan secara otomatis di database lokal browser (`localStorage`). Gunakan kredensial di bawah ini untuk menguji coba berbagai hak akses peran:

| Peran (Role) | Email Login | Kata Sandi (Password) | Hak Akses Portal |
| :--- | :--- | :--- | :--- |
| **Masyarakat (Pelapor)** | `budi.santoso@email.com` | `password123` | Portal Masyarakat |
| **Administrator** | `admin@sigap.go.id` | `admin123` | Portal Admin & Petugas |
| **Petugas PUPR** | `petugas@sigap.go.id` | `petugas123` | Portal Admin & Petugas |

---

## ⚙️ Petunjuk Pemasangan Lokal

1. **Klon Repositori**:
   ```bash
   git clone https://github.com/Revaldi-lang/SIGAP.git
   ```
2. **Jalankan Lokal Server**:
   Aplikasi ini dibangun menggunakan arsitektur statis murni (*No Build Tools*). Anda dapat menjalankannya langsung di browser Anda dengan mengeklik berkas `index.html` atau menggunakan ekstensi **Live Server** di VS Code untuk pengalaman sync perubahan yang instan.

---

## 🌐 Deployment Vercel

SIGAP telah dikonfigurasi untuk berjalan dengan baik di server **Vercel**. 

### Mengatasi Tautan Kasus Sensitif (Linux 404 Case Sensitivity)
Karena server Vercel berbasis Linux (*case-sensitive*), pastikan seluruh penamaan file dan tautan rute internal menggunakan huruf kecil murni sesuai konfigurasi repositori saat ini (`login.html`, `sigap.html`, `laporan.html`, dll.) guna menghindari kegagalan halaman tidak ditemukan (*404: NOT_FOUND*).

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
