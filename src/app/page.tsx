'use client';

import React, { useState } from 'react';
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

  return (
    <div className="min-h-screen page-shell flex flex-col pt-20 bg-background text-on-background">
      {/* Navbar */}
      <Navbar onOpenAuthModal={() => setAuthModalOpen(true)} />

      {/* Access Selector Modal */}
      <ModalAkses isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[800px] flex flex-col md:flex-row items-stretch border-b-border-width-main border-black">
          <div className="flex-1 flex flex-col justify-center px-12 md:px-20 py-16 bg-white">
            <span className="inline-block bg-primary text-on-primary border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-3 py-1 font-bold text-xs uppercase tracking-wider mb-4 w-fit">
              Portal Pengaduan Terpadu
            </span>
            <h1 className="font-black text-4xl sm:text-5xl md:text-[54px] uppercase mb-6 leading-[0.9] text-primary tracking-tight font-display">
              Solusi Cerdas Pelaporan Infrastruktur <span className="text-white bg-secondary px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Kerusakan Publik</span>
            </h1>
            <p className="font-medium text-base md:text-lg max-w-xl mb-10 text-on-surface-variant leading-relaxed">
              Laporkan jalan berlubang, lampu jalan mati, atau fasilitas umum rusak di sekitar Anda. SIGAP menjembatani aduan warga dengan tindakan perbaikan cepat dari instansi terkait.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-primary text-white border-black border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none px-8 py-4 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Mulai Lapor
              </button>
              <a
                href="#alur-section"
                className="bg-white text-primary border-black border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none px-8 py-4 font-bold text-xs uppercase tracking-wider transition-all text-center inline-block"
              >
                Lihat Progress
              </a>
            </div>
          </div>
          
          <div className="flex-1 relative min-h-[400px] border-t-4 md:border-t-0 md:border-l-border-width-main border-black overflow-hidden bg-slate-100">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590486803833-ffc6f78f88f5?auto=format&fit=crop&q=80&w=1200')" }}
            ></div>
            <div className="absolute bottom-10 left-10 right-10 bg-white border-border-width-main border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary border-2 border-black flex items-center justify-center">
                  <span className="material-symbols-outlined font-black text-white text-2xl">engineering</span>
                </div>
                <div>
                  <p className="font-bold text-xs uppercase text-primary tracking-wider">Aduan Tertangani</p>
                  <p className="text-xl md:text-2xl font-black text-primary uppercase leading-tight">{totalSelesai} Perbaikan</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Alur Pelaporan */}
        <section id="alur-section" className="py-24 px-12 md:px-20 bg-white border-b-border-width-main border-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-black text-3xl md:text-4xl uppercase mb-4 text-primary tracking-tight font-display">Alur Pelaporan</h2>
              <div className="h-2 w-48 bg-secondary mx-auto border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2">
                <div className="bg-secondary border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 aspect-video flex items-center justify-center">
                  <span className="material-symbols-outlined text-8xl text-white">dynamic_form</span>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="flex items-center gap-6 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary text-white font-black text-xl flex items-center justify-center border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">1</div>
                  <div>
                    <h3 className="font-black text-sm uppercase text-primary tracking-wider mb-1">Unggah Laporan</h3>
                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Laporkan kerusakan infrastruktur dengan foto dan lokasi melalui aplikasi SIGAP.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                  <div className="flex-shrink-0 w-16 h-16 bg-secondary text-white font-black text-xl flex items-center justify-center border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">2</div>
                  <div>
                    <h3 className="font-black text-sm uppercase text-primary tracking-wider mb-1">Tindakan Instansi</h3>
                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Tim teknis memverifikasi laporan dan menjadwalkan perbaikan di lapangan.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary text-white font-black text-xl flex items-center justify-center border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">3</div>
                  <div>
                    <h3 className="font-black text-sm uppercase text-primary tracking-wider mb-1">Hasil Perbaikan</h3>
                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Pantau hasil akhir perbaikan secara transparan untuk kenyamanan warga.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pelayanan Publik Terpadu Section */}
        <section id="info-section" className="py-24 px-12 md:px-20 bg-surface-container-low border-b-border-width-main border-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-black text-3xl md:text-4xl uppercase mb-4 text-primary tracking-tight font-display">Pelayanan Publik Terpadu</h2>
              <div className="h-2 w-48 bg-secondary mx-auto border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white border-border-width-main border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col gap-6 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-16 h-16 bg-primary border-border-width-sub border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="material-symbols-outlined text-white text-3xl">visibility</span>
                </div>
                <h3 className="font-black text-sm uppercase text-primary tracking-wider">Pemantauan Aduan</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Pantau status perbaikan infrastruktur yang Anda laporkan secara langsung.</p>
                <a className="mt-auto font-black text-xs uppercase underline decoration-4 underline-offset-4 text-primary hover:text-secondary" href="#alur-section">Tracking Laporan</a>
              </div>
              
              {/* Card 2 */}
              <div className="bg-secondary border-border-width-main border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col gap-6 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]">
                <div className="w-16 h-16 bg-primary border-border-width-sub border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="material-symbols-outlined text-white text-3xl">map</span>
                </div>
                <h3 className="font-black text-sm uppercase text-white tracking-wider">Database Infrastruktur</h3>
                <p className="text-xs text-white/90 font-medium leading-relaxed">Data kerusakan terintegrasi untuk perencanaan perbaikan kota yang lebih efisien.</p>
                <a className="mt-auto font-black text-xs uppercase underline decoration-4 underline-offset-4 text-white hover:text-primary" href="#alur-section">Lihat Peta Kota</a>
              </div>
              
              {/* Card 3 */}
              <div className="bg-white border-border-width-main border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col gap-6 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-16 h-16 bg-primary border-border-width-sub border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="material-symbols-outlined text-white text-3xl">verified</span>
                </div>
                <h3 className="font-black text-sm uppercase text-primary tracking-wider">Aduan Transparan</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Setiap laporan diverifikasi dan dipublikasikan untuk menjamin akuntabilitas perbaikan.</p>
                <a className="mt-auto font-black text-xs uppercase underline decoration-4 underline-offset-4 text-primary hover:text-secondary" href="#alur-section">Cek Akuntabilitas</a>
              </div>
            </div>
          </div>
        </section>

        {/* Empat Langkah Mudah Section */}
        <section id="alur-section-steps" className="py-24 px-12 md:px-20 border-b-border-width-main border-black bg-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3 sticky top-32">
              <h2 className="font-black text-3xl md:text-4xl uppercase mb-6 leading-none text-primary tracking-tight font-display">Empat Langkah Mudah</h2>
              <p className="text-sm font-medium text-on-surface-variant mb-8 leading-relaxed">Partisipasi aktif Anda sangat berarti untuk percepatan perbaikan infrastruktur publik.</p>
              <div className="w-full h-64 bg-surface-container border-border-width-main border-black flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <span className="material-symbols-outlined text-7xl text-primary opacity-25">report_problem</span>
              </div>
            </div>
            
            <div className="md:w-2/3 space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-16 h-16 bg-primary text-white font-black text-xl flex items-center justify-center border-border-width-main border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-105">1</div>
                <div className="pt-2">
                  <h4 className="font-black text-sm uppercase mb-2 text-primary tracking-wider">Registrasi Akun</h4>
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Lakukan pendaftaran singkat untuk melacak aduan dan mendapatkan update perbaikan.</p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-16 h-16 bg-secondary text-white font-black text-xl flex items-center justify-center border-border-width-main border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-105">2</div>
                <div className="pt-2">
                  <h4 className="font-black text-sm uppercase mb-2 text-primary tracking-wider">Kirim Aduan Kerusakan</h4>
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Unggah foto bukti kerusakan dan sematkan lokasi yang akurat di peta SIGAP.</p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-16 h-16 bg-primary text-white font-black text-xl flex items-center justify-center border-border-width-main border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-105">3</div>
                <div className="pt-2">
                  <h4 className="font-black text-sm uppercase mb-2 text-primary tracking-wider">Verifikasi &amp; Audit Lapangan</h4>
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Petugas kami akan mendatangi lokasi untuk memvalidasi kerusakan dan tingkat urgensi.</p>
                </div>
              </div>
              {/* Step 4 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-16 h-16 bg-secondary text-white font-black text-xl flex items-center justify-center border-border-width-main border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-105">4</div>
                <div className="pt-2">
                  <h4 className="font-black text-sm uppercase mb-2 text-primary tracking-wider">Update Status &amp; Selesai</h4>
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Dapatkan notifikasi progres perbaikan hingga infrastruktur kembali berfungsi dengan baik.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOP & Alur Kerja Section */}
        <section id="proses-section" className="py-24 px-12 md:px-20 bg-white border-b-border-width-main border-black">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-black text-3xl md:text-4xl uppercase mb-12 text-center text-primary tracking-tight font-display">SOP &amp; Alur Kerja</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-full md:h-[500px]">
              <div className="md:col-span-2 md:row-span-2 bg-primary border-border-width-main border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col justify-end text-white">
                <span className="material-symbols-outlined text-6xl mb-6">assignment_turned_in</span>
                <h3 className="font-black text-xl sm:text-2xl uppercase mb-4 tracking-tight">Protokol Perbaikan</h3>
                <p className="text-xs opacity-80 leading-relaxed font-medium">Setiap aduan diproses berdasarkan Standar Pelayanan Minimal (SPM) untuk menjamin kualitas perbaikan infrastruktur yang tahan lama.</p>
              </div>
              <div className="md:col-span-2 bg-secondary border-border-width-main border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-white flex flex-col justify-center">
                <h3 className="font-black text-sm uppercase tracking-wider mb-6">Siklus Laporan</h3>
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider">Warga Lapor</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                  <span className="font-bold text-xs uppercase tracking-wider">Instansi Verif</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                  <span className="font-bold text-xs uppercase tracking-wider">Vendor Kerja</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                  <span className="font-bold text-xs uppercase tracking-wider">Publik Cek</span>
                </div>
              </div>
              <div className="md:col-span-1 bg-white border-border-width-main border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-4xl mb-2 text-primary">safety_check</span>
                <p className="font-bold text-xs uppercase tracking-wider text-primary">Standard Keamanan</p>
              </div>
              <div className="md:col-span-1 bg-primary text-white border-border-width-main border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-4xl mb-2 text-white">groups</span>
                <p className="font-bold text-xs uppercase tracking-wider text-white">Audit Masyarakat</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dampak Nyata (Stats & Testimonials) */}
        <section id="suara-warga-section" className="py-24 px-12 md:px-20 bg-primary text-white border-b-border-width-main border-black shadow-[0_-4px_0px_0px_rgba(0,0,0,1)]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16">
            <div className="md:w-1/2">
              <h2 className="font-black text-3xl md:text-[40px] uppercase mb-12 leading-none tracking-tight font-display">Dampak Nyata Untuk Kota Kita</h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="font-black text-4xl md:text-5xl text-secondary mb-1">92%</p>
                  <p className="font-bold text-xs uppercase tracking-wider opacity-75">Aduan Tuntas</p>
                </div>
                <div>
                  <p className="font-black text-4xl md:text-5xl text-secondary mb-1">340+</p>
                  <p className="font-bold text-xs uppercase tracking-wider opacity-75">Mitra Perbaikan</p>
                </div>
                <div>
                  <p className="font-black text-4xl md:text-5xl text-secondary mb-1">15mnt</p>
                  <p className="font-bold text-xs uppercase tracking-wider opacity-75">Respon Awal Rata-rata</p>
                </div>
                <div>
                  <p className="font-black text-4xl md:text-5xl text-secondary mb-1">{totalSelesai}</p>
                  <p className="font-bold text-xs uppercase tracking-wider opacity-75">Laporan Selesai</p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 flex flex-col gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white text-primary border-border-width-main border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] p-8">
                <p className="text-base italic mb-6 leading-relaxed font-medium">&quot;Lubang jalan di depan rumah yang sudah berbulan-bulan rusak akhirnya diperbaiki dalam waktu 3 hari setelah saya lapor lewat SIGAP. Sangat membantu!&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined text-white">person</span>
                  </div>
                  <div>
                    <p className="font-black text-xs uppercase tracking-wider">Budi Santoso</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Warga Jakarta Selatan</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-secondary text-white border-border-width-main border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] p-8 md:translate-x-6">
                <p className="text-base italic mb-6 leading-relaxed font-medium">&quot;Lampu jalan yang mati sering membuat kawasan kami rawan. Lewat aduan transparan di SIGAP, kami bisa memantau kapan petugas datang memperbaiki.&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary border-2 border-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)]">
                    <span className="material-symbols-outlined text-white">person</span>
                  </div>
                  <div>
                    <p className="font-black text-xs uppercase tracking-wider">Ani Wijaya</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-85">Ketua RW</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-12 md:px-20 bg-surface-container-low">
          <div className="bg-primary p-12 md:p-20 text-center border-border-width-main border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-6xl mx-auto">
            <h2 className="font-black text-4xl sm:text-5xl text-white uppercase mb-8 leading-[0.9] tracking-tight font-display">
              Membangun Infrastruktur <br/><span className="text-secondary bg-white border-4 border-black px-4 inline-block mt-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Yang Lebih SIGAP</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-secondary border-4 border-white text-white font-black px-12 py-6 text-sm uppercase shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
              >
                Mulai Lapor
              </button>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-primary border-4 border-white text-white font-black px-12 py-6 text-sm uppercase shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
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
