'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ModalAkses from '@/components/ModalAkses';
import { useApp } from '@/context/AppContext';

export default function LandingPage() {
  const { laporan, loading } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const totalAduan = loading ? '15,642' : laporan.length.toLocaleString();
  const totalSelesai = loading ? '15,310' : laporan.filter(l => l.status === 'selesai').length.toLocaleString();

  return (
    <div className="min-h-screen page-shell flex flex-col pt-20">
      <Navbar onOpenAuthModal={() => setAuthModalOpen(true)} />
      <ModalAkses isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <main className="flex-grow">
        {/* ── Hero Section ───────────────────────────────────── */}
        <section
          className="relative overflow-hidden py-24 md:py-32 px-6 md:px-16"
          style={{ background: 'linear-gradient(135deg, #001360 0%, #0022A8 60%, #001A80 100%)' }}
        >
          {/* subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#ffffff 0.8px, transparent 0.8px)', backgroundSize: '24px 24px' }}
          />

          <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center relative z-10">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 text-[11px] font-bold text-white/90 tracking-widest uppercase bg-white/10 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Portal Resmi Pelayanan
            </span>

            <h1 className="font-display-lg text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold text-white max-w-4xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Efisiensi Publik Dalam Satu Genggaman.
            </h1>

            <p className="font-body-lg text-base sm:text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed mt-6">
              SIGAP menghadirkan transparansi dan kemudahan akses bagi setiap warga negara. Lapor, pantau, dan selesaikan urusan aduan Anda dengan standar layanan terbaik.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8 w-full">
              {/* Primary CTA — Tomorro pill shape, navy palette: white on dark */}
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-white text-[#001360] px-8 py-3.5 rounded-[28px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all active:scale-95 cursor-pointer min-h-[48px] text-sm shadow-lg"
              >
                Buat Laporan Sekarang
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>

              {/* Secondary CTA */}
              <a
                href="#info-section"
                className="border border-white/40 text-white px-8 py-3.5 rounded-[28px] font-semibold hover:bg-white/10 transition-all text-center inline-flex items-center min-h-[48px] text-sm justify-center"
              >
                Pelajari Selengkapnya
              </a>
            </div>

            {/* Stats Row */}
            <div className="flex justify-center gap-12 md:gap-20 pt-8 border-t border-white/10 mt-12 w-full max-w-3xl">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white">{loading ? '98%' : '100%'}</div>
                <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider mt-1">Penyelesaian</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white">{totalAduan}</div>
                <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider mt-1">Laporan Masuk</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white">{totalSelesai}</div>
                <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider mt-1">Laporan Selesai</div>
              </div>
            </div>

            {/* Centered Hero Image Block */}
            <div className="relative w-full max-w-4xl mt-16 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div
                className="aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-700"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              
              {/* Floating Card - overlayed inside the image block for clean presentation */}
              <div className="absolute bottom-6 left-6 bg-white p-5 rounded-2xl border border-[#E5E2E1] max-w-[260px] shadow-xl text-left hidden md:block">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-emerald-600 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <span className="font-bold text-xs text-[#1C1B18]">Data Terenkripsi</span>
                </div>
                <p className="text-[11px] text-[#4E4639] leading-relaxed">
                  Setiap laporan diproses dengan protokol keamanan cloud untuk menjamin kerahasiaan identitas Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────── */}
        <section id="info-section" className="py-24 px-6 md:px-16 bg-white">
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-16 max-w-2xl">
              <span className="text-[11px] font-bold text-[#001360] tracking-widest uppercase bg-[#001360]/08 px-3 py-1.5 rounded-full border border-[#001360]/12 inline-block mb-4">
                Fitur Unggulan
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001360] mb-4 leading-tight">Solusi Terpadu Masyarakat</h2>
              <p className="text-base text-[#4E4639] leading-relaxed">
                Kami menyederhanakan kompleksitas birokrasi menjadi antarmuka yang intuitif dan fungsional untuk segala kebutuhan pelaporan Anda.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: 'description', title: 'Pelaporan Cepat', desc: 'Laporkan keluhan atau insiden fasilitas publik hanya dalam hitungan detik dengan sistem otomatisasi geocoding.' },
                { icon: 'folder_open', title: 'Arsip Digital', desc: 'Akses semua dokumen penting dan riwayat laporan Anda dalam satu repositori terpusat yang aman di dasbor.' },
                { icon: 'notifications_active', title: 'Pantauan Real-time', desc: 'Dapatkan riwayat progres disposisi aduan Anda secara instan hingga status dinyatakan selesai oleh petugas.' },
              ].map(f => (
                <div
                  key={f.title}
                  className="legacy-card p-8 flex flex-col gap-5 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,19,96,0.10)] hover:-translate-y-0.5 hover:border-[#001360]/20 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#001360]/10 flex items-center justify-center text-[#001360] group-hover:bg-[#001360] group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined">{f.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg text-[#1C1B18]">{f.title}</h3>
                  <p className="text-sm text-[#4E4639] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────── */}
        <section id="alur-section" className="py-24 px-6 md:px-16 bg-[#F6F3EC]">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-16">
              <span className="text-[11px] font-bold text-[#001360] tracking-widest uppercase bg-[#001360]/08 px-3 py-1.5 rounded-full border border-[#001360]/12 inline-block mb-4">
                Cara Kerja
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001360] mb-4">Empat Langkah Mudah</h2>
              <p className="text-base text-[#4E4639] max-w-xl mx-auto leading-relaxed">
                Dirancang untuk kecepatan dan kemudahan akses bagi seluruh lapisan masyarakat.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {[
                { step: 1, title: 'Masuk Akun', desc: 'Otentikasi melalui akun Google atau pendaftaran mandiri demi validitas.', active: false },
                { step: 2, title: 'Isi Formulir', desc: 'Tulis deskripsi kendala Anda dengan lampiran bukti visual dan lokasi peta.', active: false },
                { step: 3, title: 'Verifikasi', desc: 'Tim SIGAP melakukan validasi kebenaran laporan dalam waktu singkat.', active: false },
                { step: 4, title: 'Tindak Lanjut', desc: 'Laporan didisposisi ke dinas terkait untuk segera mulai diperbaiki.', active: true },
              ].map(s => (
                <div key={s.step} className="relative z-10 text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto font-bold text-xl shadow-sm transition-all ${
                    s.active
                      ? 'bg-[#001360] text-white shadow-[0_4px_12px_rgba(0,19,96,0.30)]'
                      : 'bg-white border-2 border-[#D3C5B1] text-[#001360]'
                  }`}>
                    {s.step}
                  </div>
                  <h4 className="font-bold text-sm text-[#1C1B18] uppercase tracking-wide">{s.title}</h4>
                  <p className="text-sm text-[#4E4639] px-2 leading-relaxed">{s.desc}</p>
                </div>
              ))}
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-[12.5%] w-[75%] h-[1px] bg-gradient-to-r from-[#D3C5B1] via-[#001360]/30 to-[#D3C5B1]" />
            </div>
          </div>
        </section>

        {/* ── SOP Section ─────────────────────────────────────── */}
        <section id="proses-section" className="py-24 px-6 md:px-16 bg-white">
          <div className="max-w-[1280px] mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-[11px] font-bold text-[#001360] tracking-widest uppercase bg-[#001360]/08 px-3 py-1.5 rounded-full border border-[#001360]/12 inline-block mb-4">
                Standar Operasional
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001360] mb-4">SOP &amp; Alur Penyelesaian Laporan</h2>
              <p className="text-base text-[#4E4639] leading-relaxed">
                Kami menjamin akuntabilitas setiap keluhan yang masuk dengan alur kerja profesional yang terdokumentasi rapi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div className="space-y-6">
                {[
                  { n: 1, title: 'Respon Awal Dinas', desc: 'Estimasi verifikasi & peninjauan laporan awal dalam waktu 3 jam sejak laporan dikirim warga.' },
                  { n: 2, title: 'Disposisi Lapangan', desc: 'Petugas dinas terkait langsung diterjunkan ke titik lokasi dalam waktu maksimal 12 jam.' },
                  { n: 3, title: 'Pekerjaan Teknis', desc: 'Penyelesaian perbaikan jalan, penerangan jalan atau selokan selesai dalam rata-rata waktu 24–48 jam.' },
                ].map(item => (
                  <div key={item.n} className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#001360]/10 flex items-center justify-center text-[#001360] font-bold text-sm border border-[#001360]/15">
                      {item.n}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1C1B18]">{item.title}</h4>
                      <p className="text-sm text-[#4E4639] mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-[#E5E2E1] shadow-sm"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </div>
          </div>
        </section>

        {/* ── Testimonials ────────────────────────────────────── */}
        <section id="suara-warga-section" className="py-24 px-6 md:px-16 bg-[#F6F3EC]">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-16">
              <span className="text-[11px] font-bold text-[#001360] tracking-widest uppercase bg-[#001360]/08 px-3 py-1.5 rounded-full border border-[#001360]/12 inline-block mb-4">
                Suara Warga
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001360] mb-4">Dipercaya Oleh Ribuan Masyarakat</h2>
              <p className="text-base text-[#4E4639] max-w-xl mx-auto leading-relaxed">
                Kualitas pelayanan publik kami diukur dari kepuasan dan kemudahan yang dirasakan oleh setiap individu.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: '"Laporan saya tentang jalan berlubang besar di depan komplek direspons sangat cepat. Dalam waktu singkat, regu perbaikan jalan dinas sudah datang menambal."',
                  name: 'Budi Santoso', loc: 'Warga, Klojen',
                  img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'
                },
                {
                  quote: '"Lampu penerangan jalan padam berbulan-bulan. Setelah saya laporkan lewat SIGAP dan sematkan koordinat peta, dinas Dishub langsung mengganti bohlam baru esok harinya!"',
                  name: 'Siti Aminah', loc: 'Warga, Lowokwaru',
                  img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80'
                },
                {
                  quote: '"Transparansi pelacakan di SIGAP ini luar biasa. Kita bisa tahu persis laporan sudah diverifikasi, diproses oleh dinas apa, dan mendapat foto bukti perbaikan."',
                  name: 'Rahmat Hidayat', loc: 'Warga, Sukun',
                  img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80'
                },
              ].map((t, i) => (
                <div key={i} className="legacy-card p-8 rounded-2xl flex flex-col justify-between hover:shadow-[0_8px_24px_rgba(0,19,96,0.10)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex gap-1 text-amber-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                    <p className="text-sm italic text-[#1C1B18] leading-relaxed">{t.quote}</p>
                  </div>
                  <div className="flex items-center gap-4 pt-5 border-t border-[#E5E2E1] mt-5">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0"
                      style={{ backgroundImage: `url('${t.img}')`, backgroundSize: 'cover' }} />
                    <div>
                      <div className="font-bold text-xs text-[#1C1B18]">{t.name}</div>
                      <div className="text-[10px] text-[#807667] mt-0.5">{t.loc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Bottom ──────────────────────────────────────── */}
        <section className="px-6 md:px-16 py-24 bg-white">
          <div className="max-w-[1280px] mx-auto">
            <div
              className="rounded-2xl p-12 md:p-20 text-center text-white relative overflow-hidden shadow-xl"
              style={{ background: 'linear-gradient(135deg, #001360 0%, #0022A8 100%)' }}
            >
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#ffffff 0.8px, transparent 0.8px)', backgroundSize: '24px 24px' }} />
              <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold mb-5 relative z-10 text-white leading-tight">
                Siap Untuk Pelayanan Yang Lebih Baik?
              </h2>
              <p className="text-base mb-10 max-w-2xl mx-auto opacity-80 relative z-10 leading-relaxed">
                Bergabunglah dengan ribuan masyarakat yang telah merasakan kemudahan birokrasi pengaduan digital bersama SIGAP.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-4 relative z-10">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-white text-[#001360] px-10 py-3.5 rounded-[28px] font-bold hover:bg-slate-100 transition-all cursor-pointer shadow-lg min-h-[48px] text-sm"
                >
                  Mulai Laporkan Sekarang
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
