'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ModalAkses from '@/components/ModalAkses';
import { useApp } from '@/context/AppContext';

export default function LandingPage() {
  const { laporan, loading } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Dynamic statistics from database with fallbacks
  const totalAduan = loading ? '15,642' : laporan.length.toLocaleString();
  const totalSelesai = loading ? '15,310' : laporan.filter(l => l.status === 'selesai').length.toLocaleString();

  const partnerLogos = [
    { src: '/assets/images/logo_dki.png', alt: 'Pemprov DKI Jakarta' },
    { src: '/assets/images/logo_pupr.png', alt: 'Kementerian PUPR' },
    { src: '/assets/images/logo_dishub.png', alt: 'Dinas Perhubungan' },
    { src: '/assets/images/logo_dlh.png', alt: 'Dinas Lingkungan Hidup' }
  ];

  // Repeat the logos 8 times per set to cover all screens and loop seamlessly
  const repeatedLogos = Array(8).fill(partnerLogos).flat();

  return (
    <div className="min-h-screen page-shell flex flex-col pt-20 bg-background text-on-background">
      {/* Navbar */}
      <Navbar onOpenAuthModal={() => setAuthModalOpen(true)} />

      {/* Access Selector Modal */}
      <ModalAkses isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[700px] flex items-center border-b border-slate-100 overflow-hidden bg-slate-950">
          {/* Full-width Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-85 z-0"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600')" }}
          ></div>
          
          {/* Gradient Overlay: Solid black on the left, fading out to transparent on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent z-10"></div>
          
          {/* Content Area */}
          <div className="relative z-20 w-full px-6 md:px-20 max-w-[1280px] mx-auto py-24 flex flex-col md:flex-row items-center">
            <div className="max-w-2xl text-white animate-slide-in">
              <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl mb-6 leading-tight tracking-tight text-white">
                <span className="text-primary">SIGAP</span> Hadir <br/>Untuk Warga
              </h1>
              <p className="font-normal text-sm md:text-base max-w-lg mb-10 text-slate-300 leading-relaxed">
                Layanan pengaduan dan aspirasi kerusakan jalan, lampu jalan, drainase, dan fasilitas umum terintegrasi langsung dengan dinas teknis daerah.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-primary text-white hover:bg-primary/90 px-8 py-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98] cursor-pointer"
                >
                  Mulai Lapor
                </button>
                <Link
                  href="/progress"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all text-center inline-block"
                >
                  Lihat Progress
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Alur Pelaporan */}
        <section id="alur-section" className="py-24 px-12 md:px-20 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-bold text-3xl md:text-4xl text-slate-900 tracking-tight">Alur Pelaporan</h2>
              <div className="h-1 w-20 bg-primary/20 mx-auto rounded-full mt-3"></div>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2">
                <div 
                  className="w-full aspect-video border border-slate-200 shadow-md rounded-2xl bg-cover bg-center"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800')" }}
                ></div>
              </div>
              
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="flex items-center gap-6 bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 hover:shadow-md hover:border-slate-200 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary font-bold text-lg rounded-xl flex items-center justify-center">1</div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-800 tracking-wide mb-1">Unggah Laporan</h3>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">Laporkan kerusakan infrastruktur dengan foto dan lokasi melalui aplikasi SIGAP.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 hover:shadow-md hover:border-slate-200 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary font-bold text-lg rounded-xl flex items-center justify-center">2</div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-800 tracking-wide mb-1">Tindakan Instansi</h3>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">Tim teknis memverifikasi laporan dan menjadwalkan perbaikan di lapangan.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 hover:shadow-md hover:border-slate-200 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary font-bold text-lg rounded-xl flex items-center justify-center">3</div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-800 tracking-wide mb-1">Hasil Perbaikan</h3>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">Pantau hasil akhir perbaikan secara transparan untuk kenyamanan warga.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pelayanan Publik Terpadu Section */}
        <section id="info-section" className="py-24 px-12 md:px-20 bg-slate-50/50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-bold text-3xl md:text-4xl text-slate-900 tracking-tight">Pelayanan Publik Terpadu</h2>
              <div className="h-1 w-20 bg-primary/20 mx-auto rounded-full mt-3"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 hover:shadow-md hover:border-slate-200">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">visibility</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-800 tracking-wide">Pemantauan Aduan</h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">Pantau status perbaikan infrastruktur yang Anda laporkan secara langsung.</p>
                <Link className="mt-auto font-semibold text-xs uppercase tracking-wider text-primary hover:text-primary/80 inline-flex items-center gap-1" href="/login-masyarakat">Tracking Laporan <span className="material-symbols-outlined text-[10px]">arrow_right_alt</span></Link>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 hover:shadow-md hover:border-slate-200">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">map</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-800 tracking-wide">Database Infrastruktur</h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">Data kerusakan terintegrasi untuk perencanaan perbaikan kota yang lebih efisien.</p>
                <Link className="mt-auto font-semibold text-xs uppercase tracking-wider text-primary hover:text-primary/80 inline-flex items-center gap-1" href="/login-masyarakat">Lihat Peta Kota <span className="material-symbols-outlined text-[10px]">arrow_right_alt</span></Link>
              </div>
              
              {/* Card 3 */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 hover:shadow-md hover:border-slate-200">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-800 tracking-wide">Aduan Transparan</h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">Setiap laporan diverifikasi dan dipublikasikan untuk menjamin akuntabilitas perbaikan.</p>
                <Link className="mt-auto font-semibold text-xs uppercase tracking-wider text-primary hover:text-primary/80 inline-flex items-center gap-1" href="/login-masyarakat">Cek Akuntabilitas <span className="material-symbols-outlined text-[10px]">arrow_right_alt</span></Link>
              </div>
            </div>
          </div>
        </section>

        {/* Empat Langkah Mudah Section */}
        <section id="alur-section-steps" className="py-24 px-6 md:px-20 border-b border-slate-100 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3 md:sticky md:top-32">
              <h2 className="font-bold text-3xl md:text-4xl text-slate-900 tracking-tight mb-6">Empat Langkah Mudah</h2>
              <p className="text-sm font-normal text-slate-500 mb-8 leading-relaxed">Partisipasi aktif Anda sangat berarti untuk percepatan perbaikan infrastruktur publik.</p>
              <div 
                className="w-full aspect-[4/3] border border-slate-200 shadow-md rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/images/perbaikan_jalan.png')" }}
              ></div>
            </div>
            
            <div className="md:w-2/3 space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary font-semibold text-base rounded-full flex items-center justify-center transition-transform group-hover:scale-105">1</div>
                <div className="pt-1">
                  <h4 className="font-semibold text-sm text-slate-800 tracking-wide mb-2">Registrasi Akun</h4>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">Lakukan pendaftaran singkat untuk melacak aduan dan mendapatkan update perbaikan.</p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary font-semibold text-base rounded-full flex items-center justify-center transition-transform group-hover:scale-105">2</div>
                <div className="pt-1">
                  <h4 className="font-semibold text-sm text-slate-800 tracking-wide mb-2">Kirim Aduan Kerusakan</h4>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">Unggah foto bukti kerusakan dan sematkan lokasi yang akurat di peta SIGAP.</p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary font-semibold text-base rounded-full flex items-center justify-center transition-transform group-hover:scale-105">3</div>
                <div className="pt-1">
                  <h4 className="font-semibold text-sm text-slate-800 tracking-wide mb-2">Verifikasi &amp; Audit Lapangan</h4>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">Petugas kami akan mendatangi lokasi untuk memvalidasi kerusakan dan tingkat urgensi.</p>
                </div>
              </div>
              {/* Step 4 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary font-semibold text-base rounded-full flex items-center justify-center transition-transform group-hover:scale-105">4</div>
                <div className="pt-1">
                  <h4 className="font-semibold text-sm text-slate-800 tracking-wide mb-2">Update Status &amp; Selesai</h4>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">Dapatkan notifikasi progres perbaikan hingga infrastruktur kembali berfungsi dengan baik.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership & Dinas Logos Marquee Section */}
        <section className="py-8 bg-slate-50 border-b border-slate-100 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 mb-6 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Instansi Penyelenggara &amp; Teknis Terkait</p>
          </div>
          <div className="relative w-full overflow-hidden flex items-center bg-white border-y border-slate-100 py-5">
            <div className="animate-marquee flex items-center">
              {/* First set of logos */}
              <div className="flex items-center gap-12 md:gap-16 pr-12 md:pr-16 shrink-0">
                {repeatedLogos.map((logo, idx) => (
                  <img 
                    key={`set1-${idx}`}
                    src={logo.src}
                    alt={logo.alt}
                    className="h-8 w-8 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                  />
                ))}
              </div>
              {/* Second set of logos (duplicate for seamless loop) */}
              <div className="flex items-center gap-12 md:gap-16 pr-12 md:pr-16 shrink-0">
                {repeatedLogos.map((logo, idx) => (
                  <img 
                    key={`set2-${idx}`}
                    src={logo.src}
                    alt={logo.alt}
                    className="h-8 w-8 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SOP & Alur Kerja Section */}
        <section id="proses-section" className="py-24 px-6 md:px-20 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-bold text-3xl md:text-4xl text-center text-slate-900 tracking-tight mb-16">SOP &amp; Alur Kerja</h2>
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left: Protokol Perbaikan */}
              <div className="lg:w-2/5 bg-primary rounded-2xl shadow-lg p-10 flex flex-col text-white">
                <div className="mb-8">
                  <span className="material-symbols-outlined text-6xl text-white">assignment_turned_in</span>
                </div>
                <h3 className="font-bold text-2xl md:text-3xl mb-6 leading-tight font-display">Protokol Perbaikan (SPM)</h3>
                <p className="text-sm mb-8 opacity-90 leading-relaxed font-medium">Setiap laporan diproses berdasarkan Standar Pelayanan Minimal (SPM) Kota untuk memastikan penanganan yang cepat dan struktur yang kokoh:</p>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-white/40 shrink-0"></div>
                    <p className="text-xs font-semibold"><strong className="text-white uppercase">Respon Awal:</strong> Validasi berkas kelayakan &amp; kategori aduan maksimal 3 jam.</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-white/40 shrink-0"></div>
                    <p className="text-xs font-semibold"><strong className="text-white uppercase">Survei Teknis:</strong> Kunjungan lokasi oleh dinas PUPR/Dishub maksimal 12 jam.</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-white/40 shrink-0"></div>
                    <p className="text-xs font-semibold"><strong className="text-white uppercase">Estimasi Pekerjaan:</strong> Selesai dalam 24 - 48 jam untuk kerusakan umum.</p>
                  </li>
                </ul>
              </div>

              {/* Right: Siklus Laporan */}
              <div className="lg:w-3/5">
                <div className="mb-10 flex items-center gap-4 text-primary">
                  <span className="material-symbols-outlined text-4xl">sync_alt</span>
                  <h3 className="font-semibold text-xl uppercase font-display">Siklus Laporan Pelanggan</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Step 1 */}
                  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md hover:border-slate-300">
                    <div className="w-full aspect-square mb-6 overflow-hidden border border-slate-100 rounded-xl flex items-center justify-center bg-slate-50/50">
                      <div className="w-[85%] h-[85%] bg-no-repeat bg-contain bg-center" style={{ backgroundImage: "url('/assets/images/sop_sprite.png')", backgroundSize: "200% 200%", backgroundPosition: "0% 0%" }} />
                    </div>
                    <h4 className="font-semibold text-base text-slate-800 mb-2 font-display">01. LAPOR</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">Warga menyematkan foto &amp; lokasi GPS kerusakan.</p>
                  </div>
                  {/* Step 2 */}
                  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md hover:border-slate-300">
                    <div className="w-full aspect-square mb-6 overflow-hidden border border-slate-100 rounded-xl flex items-center justify-center bg-slate-50/50">
                      <div className="w-[85%] h-[85%] bg-no-repeat bg-contain bg-center" style={{ backgroundImage: "url('/assets/images/sop_sprite.png')", backgroundSize: "200% 200%", backgroundPosition: "100% 0%" }} />
                    </div>
                    <h4 className="font-semibold text-base text-slate-800 mb-2 font-display">02. VERIFIKASI</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">Admin memvalidasi dan disposisi laporan ke dinas terkait.</p>
                  </div>
                  {/* Step 3 */}
                  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md hover:border-slate-300">
                    <div className="w-full aspect-square mb-6 overflow-hidden border border-slate-100 rounded-xl flex items-center justify-center bg-slate-50/50">
                      <div className="w-[85%] h-[85%] bg-no-repeat bg-contain bg-center" style={{ backgroundImage: "url('/assets/images/sop_sprite.png')", backgroundSize: "200% 200%", backgroundPosition: "0% 100%" }} />
                    </div>
                    <h4 className="font-semibold text-base text-slate-800 mb-2 font-display">03. PENANGANAN</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">Tim lapangan PUPR/Dishub datang melakukan perbaikan.</p>
                  </div>
                  {/* Step 4 */}
                  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md hover:border-slate-300">
                    <div className="w-full aspect-square mb-6 overflow-hidden border border-slate-100 rounded-xl flex items-center justify-center bg-slate-50/50">
                      <div className="w-[85%] h-[85%] bg-no-repeat bg-contain bg-center" style={{ backgroundImage: "url('/assets/images/sop_sprite.png')", backgroundSize: "200% 200%", backgroundPosition: "100% 100%" }} />
                    </div>
                    <h4 className="font-semibold text-base text-slate-800 mb-2 font-display">04. KONTROL</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">Laporan dipublikasikan dan dinilai langsung oleh pelapor.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 flex items-start gap-6">
                <div className="bg-primary/10 text-primary p-3 rounded-xl shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary">security</span>
                </div>
                <div>
                  <h4 className="font-semibold text-base text-slate-800 mb-2 font-display">Standard Keamanan Data</h4>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">Kami melindungi privasi dan identitas pelapor sepenuhnya dengan enkripsi data SSL tingkat tinggi dan penyimpanan cloud yang aman.</p>
                </div>
              </div>
              <div className="bg-slate-900 shadow-md rounded-2xl p-8 flex items-start gap-6 text-white">
                <div className="bg-white/10 text-white p-3 rounded-xl shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-white">groups</span>
                </div>
                <div>
                  <h4 className="font-semibold text-base text-white mb-2 font-display">Transparansi &amp; Audit Masyarakat</h4>
                  <p className="text-xs text-white/80 font-semibold leading-relaxed">Setiap tahapan pekerjaan terdokumentasi rapi. Warga berhak memberikan umpan balik (feedback) dan penilaian performa dinas secara transparan.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dampak Nyata (Stats & Testimonials) */}
        <section id="suara-warga-section" className="py-24 px-6 md:px-20 bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16">
            <div className="md:w-1/2">
              <h2 className="font-bold text-3xl md:text-[40px] mb-12 leading-none tracking-tight font-display">Dampak Nyata Untuk Kota Kita</h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="font-extrabold text-4xl md:text-5xl text-blue-400 mb-1">92%</p>
                  <p className="font-semibold text-xs uppercase tracking-wider opacity-75">Aduan Tuntas</p>
                </div>
                <div>
                  <p className="font-extrabold text-4xl md:text-5xl text-blue-400 mb-1">340+</p>
                  <p className="font-semibold text-xs uppercase tracking-wider opacity-75">Mitra Perbaikan</p>
                </div>
                <div>
                  <p className="font-extrabold text-4xl md:text-5xl text-blue-400 mb-1">15mnt</p>
                  <p className="font-semibold text-xs uppercase tracking-wider opacity-75">Respon Awal Rata-rata</p>
                </div>
                <div>
                  <p className="font-extrabold text-4xl md:text-5xl text-blue-400 mb-1">{totalSelesai}</p>
                  <p className="font-semibold text-xs uppercase tracking-wider opacity-75">Laporan Selesai</p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 flex flex-col gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white text-slate-800 border border-slate-200 shadow-lg rounded-2xl p-8">
                <p className="text-base italic mb-6 leading-relaxed font-medium text-slate-600">&quot;Lubang jalan di depan rumah yang sudah berbulan-bulan rusak akhirnya diperbaiki dalam waktu 3 hari setelah saya lapor lewat SIGAP. Sangat membantu!&quot;</p>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full border border-slate-200 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80')" }}
                  ></div>
                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider text-slate-800">Budi Santoso</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Warga Jakarta Selatan</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-slate-850 text-white border border-slate-800 bg-slate-800 shadow-lg rounded-2xl p-8 md:translate-x-6">
                <p className="text-base italic mb-6 leading-relaxed font-medium text-slate-200">&quot;Lampu jalan yang mati sering membuat kawasan kami rawan. Lewat aduan transparan di SIGAP, kami bisa memantau kapan petugas datang memperbaiki.&quot;</p>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full border border-slate-700 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80')" }}
                  ></div>
                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider">Ani Wijaya</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider opacity-75">Ketua RW</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 md:px-20 bg-slate-50/50">
          <div className="bg-primary p-12 md:p-20 text-center rounded-3xl shadow-xl max-w-6xl mx-auto text-white">
            <h2 className="font-bold text-3xl sm:text-5xl text-white uppercase mb-8 leading-tight tracking-tight font-display">
              Membangun Infrastruktur <br/>
              <span className="text-primary bg-white px-4 py-1.5 rounded-xl inline-block mt-4 shadow-sm w-fit mx-auto font-medium">Yang Lebih SIGAP</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-white text-primary font-semibold px-8 py-4 rounded-xl text-sm uppercase transition-all hover:bg-slate-50 shadow-md cursor-pointer active:scale-95"
              >
                Mulai Lapor
              </button>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-transparent border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl text-sm uppercase transition-all cursor-pointer active:scale-95"
              >
                Kontak Darurat
              </button>
            </div>
            <p className="mt-10 font-bold text-xs text-white opacity-60 uppercase tracking-widest">Mari bergerak bersama untuk fasilitas publik yang lebih baik</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
