# 🏛️ SIGAP (Sistem Informasi Gerak Aduan Publik)

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet JS](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)

**SIGAP** adalah platform digital layanan aspirasi dan pengaduan infrastruktur daerah terintegrasi skala nasional. Dirancang untuk mempercepat birokrasi komunikasi antara masyarakat umum dan instansi pemerintah daerah terkait (seperti Dinas Pekerjaan Umum dan Penataan Ruang/PUPR, Dinas Perhubungan, dll.) dalam mengatasi kendala fasilitas publik (jalan berlubang, lampu penerangan padam, saluran drainase tersumbat, dll.).

Platform ini mengusung pendekatan modern **Aesthetics & Visual Excellence** dengan dominansi skema warna *warm cream* minimalis dan aksen *royal blue* yang premium, interaktif, serta responsif sepenuhnya untuk perangkat mobile maupun desktop.

---

## 🚀 Fitur Utama

1. **Sistem Sesi Dinamis & Profil Sinkron (Landing Page Sync)**
   - Saat belum masuk, pengguna disuguhkan tombol masuk yang bersih di navigasi atas.
   - Setelah masuk (*login*), tombol otomatis berubah secara dinamis menjadi lencana avatar inisial nama pelapor beserta dropdown interaktif (Dasbor, Profil, Keluar Sesi) dengan transisi mulus.
2. **Dasbor Multi-Role (Masyarakat & Admin)**
   - **Portal Masyarakat**: Mengirim aduan baru dengan menentukan koordinat peta presisi, melihat daftar aduan pribadi, melihat status pengerjaan secara real-time, dan mengelola keamanan profil warga.
   - **Portal Admin & Petugas**: Manajemen pengguna, rekapitulasi data statistik aduan, penentuan disposisi petugas lapangan, integrasi log penanganan, dan penyuntingan profil.
3. **Peta Spasial Dampak (LeafletJS Integration)**
   - Visualisasi spasial sebaran titik kerusakan fasilitas daerah secara real-time berbasis Web-GIS menggunakan LeafletJS untuk mempermudah pemetaan prioritas perbaikan oleh kedinasan.
4. **Log Riwayat Aduan (Audit Trail/Timeline)**
   - Pelacakan progres pengerjaan laporan aduan yang disajikan dalam bentuk linimasa (*timeline*) riwayat log transparan dari pelapor mengirimkan laporan hingga status pengerjaan dinyatakan selesai oleh petugas PUPR di lapangan.
5. **Database Lokal Tersinkronisasi (localStorage Engine)**
   - Menghubungkan seluruh visualisasi dinamis antardasbor secara instan tanpa database server eksternal, membuat pembaruan status laporan langsung memengaruhi data dasbor secara global.

---

## 🛠️ Tech Stack & Arsitektur

*   **Markup**: HTML5 (Semantic elements)
*   **Styling & UI**: Tailwind CSS (CDN), FontAwesome Icons v6, Google Fonts (Plus Jakarta Sans)
*   **Javascript Engine**: Vanilla JS (ES6+)
*   **Maps & GIS**: LeafletJS
*   **Database & Persistensi**: `localStorage` Database & Dynamic Page Sync

---

## 📂 Struktur Proyek

```bash
├── assets/
│   ├── css/
│   │   └── style.css            # Custom styling tambahan
│   └── js/
│       └── script.js            # Core engine database lokal, filter, login, & render profile
├── sigap.png                    # Logo utama SIGAP
├── index.html                   # Landing Page utama (Beranda)
├── login.html                   # Portal masuk Admin & Petugas PUPR/Dishub
├── login-masyarakat.html        # Portal masuk Masyarakat/Pelapor
├── register.html                # Pendaftaran akun Warga baru
├── dashboard-pelapor.html       # Dasbor khusus Pelapor/Masyarakat
├── buat-laporan.html            # Formulir pengaduan baru dengan penanda peta GPS
├── detail-laporan-pelapor.html  # Rincian & linimasa penanganan laporan untuk Pelapor
├── pengaturan-profil-pelapor.html# Pengaturan profil & keamanan sandi Pelapor
├── sigap.html                   # Dasbor utama Administrator Pemda
├── laporan.html                 # Tabel rekapitulasi aduan & disposisi penanganan oleh Admin
├── detail-laporan.html          # Detail tinjauan aduan, peta detail, & form status bagi Admin
├── peta.html                    # Peta spasial sebaran aduan bagi Admin
├── peta-pelapor.html            # Peta spasial sebaran aduan bagi Warga
├── manajemen-user.html          # Manajemen catalog pengguna (Warga, Admin, Petugas) oleh Administrator
└── pengaturan-profil.html       # Pengaturan profil & keamanan sandi Administrator/Petugas
```

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
