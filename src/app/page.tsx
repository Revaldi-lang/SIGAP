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
    <div className="min-h-screen page-shell flex flex-col pt-20">
      {/* Navbar */}
      <Navbar onOpenAuthModal={() => setAuthModalOpen(true)} />

      {/* Access Selector Modal */}
      <ModalAkses isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28 px-6 md:px-16" style={{ background: 'linear-gradient(135deg, #FDF9F3 0%, #FEFDF8 100%)' }}>
          <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-bold text-[#001360] tracking-widest uppercase bg-[#001360]/10 px-3 py-1 rounded border border-[#001360]/10">
                Portal Resmi Pelayanan
              </span>
              <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-primary max-w-xl leading-tight">
                Efisiensi Publik Dalam Satu Genggaman.
              </h1>
              <p className="font-body-lg text-base sm:text-lg text-on-surface-variant max-w-md leading-relaxed">
                SIGAP menghadirkan transparansi dan kemudahan akses bagi setiap warga negara. Lapor, pantau, dan selesaikan urusan aduan Anda dengan standar layanan terbaik.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-primary text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 cursor-pointer"
                >
                  Buat Laporan Sekarang
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <a
                  href="#info-section"
                  className="border border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary/5 transition-all text-center inline-block"
                >
                  Pelajari Selengkapnya
                </a>
              </div>
            </div>
            <div className="relative">
              <div
                className="aspect-video md:aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-[#D3C5B1] shadow-md"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
              
              {/* Tactile Overlay Element */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl border border-[#D3C5B1] hidden md:block max-w-[260px] shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-emerald-600">verified_user</span>
                  <span className="font-bold text-xs text-[#1C1B18]">Data Terenkripsi</span>
                </div>
                <p className="text-[11px] text-[#4E4639] leading-relaxed">
                  Setiap laporan diproses dengan protokol keamanan cloud untuk menjamin kerahasiaan identitas Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features (Kegunaan) */}
        <section id="info-section" className="py-20 px-6 md:px-16 bg-[#FEFDF8]">
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001360] mb-4">Solusi Terpadu Masyarakat</h2>
              <p className="text-sm sm:text-base text-[#4E4639] leading-relaxed">
                Kami menyederhanakan kompleksitas birokrasi menjadi antarmuka yang intuitif dan fungsional untuk segala kebutuhan pelaporan Anda.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="legacy-card hover:border-[#001360] p-8 flex flex-col gap-4 rounded-xl transition duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#001360]/10 flex items-center justify-center text-[#001360]">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <h3 className="font-bold text-lg text-[#1C1B18]">Pelaporan Cepat</h3>
                <p className="text-xs sm:text-sm text-[#4E4639] leading-relaxed">
                  Laporkan keluhan atau insiden fasilitas publik hanya dalam hitungan detik dengan sistem otomatisasi geocoding.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="legacy-card hover:border-[#001360] p-8 flex flex-col gap-4 rounded-xl transition duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#001360]/10 flex items-center justify-center text-[#001360]">
                  <span className="material-symbols-outlined">folder_open</span>
                </div>
                <h3 className="font-bold text-lg text-[#1C1B18]">Arsip Digital</h3>
                <p className="text-xs sm:text-sm text-[#4E4639] leading-relaxed">
                  Akses semua dokumen penting dan riwayat laporan Anda dalam satu repositori terpusat yang aman di dasbor.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="legacy-card hover:border-[#001360] p-8 flex flex-col gap-4 rounded-xl transition duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#001360]/10 flex items-center justify-center text-[#001360]">
                  <span className="material-symbols-outlined">notifications_active</span>
                </div>
                <h3 className="font-bold text-lg text-[#1C1B18]">Pantauan Real-time</h3>
                <p className="text-xs sm:text-sm text-[#4E4639] leading-relaxed">
                  Dapatkan riwayat progres disposisi aduan Anda secara instan hingga status dinyatakan selesai oleh petugas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process (Cara Melapor) */}
        <section id="alur-section" className="py-20 px-6 md:px-16 bg-[#F6F3EC]">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001360] mb-4">Empat Langkah Mudah</h2>
              <p className="text-sm sm:text-base text-[#4E4639] max-w-xl mx-auto leading-relaxed">
                Dirancang untuk kecepatan dan kemudahan akses bagi seluruh lapisan masyarakat.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="relative z-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-[#D3C5B1] flex items-center justify-center mx-auto text-[#001360] font-bold text-xl shadow-sm">1</div>
                <h4 className="font-bold text-sm text-[#1C1B18] uppercase tracking-wide">Masuk Akun</h4>
                <p className="text-xs text-[#4E4639] px-4 leading-relaxed">Otentikasi melalui akun Google atau pendaftaran mandiri demi validitas.</p>
              </div>
              {/* Step 2 */}
              <div className="relative z-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-[#D3C5B1] flex items-center justify-center mx-auto text-[#001360] font-bold text-xl shadow-sm">2</div>
                <h4 className="font-bold text-sm text-[#1C1B18] uppercase tracking-wide">Isi Formulir</h4>
                <p className="text-xs text-[#4E4639] px-4 leading-relaxed">Tulis deskripsi kendala Anda dengan lampiran bukti visual dan lokasi peta.</p>
              </div>
              {/* Step 3 */}
              <div className="relative z-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-[#D3C5B1] flex items-center justify-center mx-auto text-[#001360] font-bold text-xl shadow-sm">3</div>
                <h4 className="font-bold text-sm text-[#1C1B18] uppercase tracking-wide">Verifikasi</h4>
                <p className="text-xs text-[#4E4639] px-4 leading-relaxed">Tim SIGAP melakukan validasi kebenaran laporan dalam waktu singkat.</p>
              </div>
              {/* Step 4 */}
              <div className="relative z-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#001360] flex items-center justify-center mx-auto text-white font-bold text-xl shadow-sm">4</div>
                <h4 className="font-bold text-sm text-[#1C1B18] uppercase tracking-wide">Tindak Lanjut</h4>
                <p className="text-xs text-[#4E4639] px-4 leading-relaxed">Laporan didisposisi ke dinas terkait untuk segera mulai diperbaiki.</p>
              </div>
              {/* Decorative Line */}
              <div className="hidden md:block absolute top-8 left-0 w-full h-[1px] bg-[#D3C5B1] -z-0"></div>
            </div>
          </div>
        </section>

        {/* SOP Section */}
        <section id="proses-section" className="py-20 px-6 md:px-16 bg-[#FEFDF8]">
          <div className="max-w-[1280px] mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001360] mb-4">SOP &amp; Alur Penyelesaian Laporan</h2>
              <p className="text-sm sm:text-base text-[#4E4639] leading-relaxed">
                Kami menjamin akuntabilitas setiap keluhan yang masuk dengan alur kerja profesional yang terdokumentasi rapi.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#001360]/10 flex items-center justify-center text-[#001360] font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1C1B18]">Respon Awal Dinas</h4>
                    <p className="text-xs text-[#4E4639] mt-1 leading-relaxed">Estimasi verifikasi &amp; peninjauan laporan awal dalam waktu 3 jam sejak laporan dikirim warga.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#001360]/10 flex items-center justify-center text-[#001360] font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1C1B18]">Disposisi Lapangan</h4>
                    <p className="text-xs text-[#4E4639] mt-1 leading-relaxed">Petugas dinas terkait langsung diterjunkan ke titik lokasi dalam waktu maksimal 12 jam.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#001360]/10 flex items-center justify-center text-[#001360] font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1C1B18]">Pekerjaan Teknis</h4>
                    <p className="text-xs text-[#4E4639] mt-1 leading-relaxed">Penyelesaian perbaikan jalan, penerangan jalan atau selokan selesai dalam rata-rata waktu 24 - 48 jam.</p>
                  </div>
                </div>
              </div>
              <div
                className="aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-[#D3C5B1] shadow-sm"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
            </div>
          </div>
        </section>

        {/* Testimonials (Suara Warga) */}
        <section id="suara-warga-section" className="py-20 px-6 md:px-16 bg-[#F6F3EC]">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-16 font-body">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001360] mb-4">Dipercaya Oleh Ribuan Masyarakat</h2>
              <p className="text-sm sm:text-base text-[#4E4639] max-w-xl mx-auto leading-relaxed">
                Kualitas pelayanan publik kami diukur dari kepuasan dan kemudahan yang dirasakan oleh setiap individu.
              </p>
              <div className="flex justify-center gap-12 mt-8">
                <div>
                  <div className="text-3xl font-bold text-[#001360] mb-1">{loading ? '98%' : '100%'}</div>
                  <div className="text-[10px] font-bold text-[#4E4639] uppercase tracking-wider">Penyelesaian Cepat</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#001360] mb-1">{totalAduan}</div>
                  <div className="text-[10px] font-bold text-[#4E4639] uppercase tracking-wider">Laporan Masuk</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#001360] mb-1">{totalSelesai}</div>
                  <div className="text-[10px] font-bold text-[#4E4639] uppercase tracking-wider">Laporan Selesai</div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="legacy-card p-8 rounded-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-sm italic text-[#1C1B18] mb-6 leading-relaxed">
                    &quot;Laporan saya tentang jalan berlubang besar di depan komplek direspons sangat cepat. Dalam waktu singkat, regu perbaikan jalan dinas sudah datang menambal.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-[#D3C5B1]/50">
                  <div
                    className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80')",
                      backgroundSize: 'cover',
                    }}
                  ></div>
                  <div>
                    <div className="font-bold text-xs text-[#1C1B18]">Budi Santoso</div>
                    <div className="text-[10px] text-[#4E4639]">Warga, Klojen</div>
                  </div>
                </div>
              </div>
              {/* Testimonial 2 */}
              <div className="legacy-card p-8 rounded-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-sm italic text-[#1C1B18] mb-6 leading-relaxed">
                    &quot;Lampu penerangan jalan padam berbulan-bulan. Setelah saya laporkan lewat SIGAP dan sematkan koordinat peta, dinas Dishub langsung mengganti bohlam baru esok harinya!&quot;
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-[#D3C5B1]/50">
                  <div
                    className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80')",
                      backgroundSize: 'cover',
                    }}
                  ></div>
                  <div>
                    <div className="font-bold text-xs text-[#1C1B18]">Siti Aminah</div>
                    <div className="text-[10px] text-[#4E4639]">Warga, Lowokwaru</div>
                  </div>
                </div>
              </div>
              {/* Testimonial 3 */}
              <div className="legacy-card p-8 rounded-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-sm italic text-[#1C1B18] mb-6 leading-relaxed">
                    &quot;Transparansi pelacakan di SIGAP ini luar biasa. Kita bisa tahu persis laporan sudah diverifikasi, diproses oleh dinas apa, dan mendapat foto bukti perbaikan.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-[#D3C5B1]/50">
                  <div
                    className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80')",
                      backgroundSize: 'cover',
                    }}
                  ></div>
                  <div>
                    <div className="font-bold text-xs text-[#1C1B18]">Rahmat Hidayat</div>
                    <div className="text-[10px] text-[#4E4639]">Warga, Sukun</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 md:px-16 py-20 bg-[#FEFDF8]">
          <div className="max-w-[1280px] mx-auto bg-[#001360] rounded-2xl p-12 md:p-20 text-center text-white relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
            <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold mb-6 relative z-10 text-white">Siap Untuk Pelayanan Yang Lebih Baik?</h2>
            <p className="text-sm sm:text-base mb-10 max-w-2xl mx-auto opacity-90 relative z-10 leading-relaxed">
              Bergabunglah dengan ribuan masyarakat yang telah merasakan kemudahan birokrasi pengaduan digital bersama SIGAP.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 relative z-10">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-white text-[#001360] px-10 py-4 rounded-lg font-bold hover:bg-slate-100 transition-all cursor-pointer shadow-md"
              >
                Mulai Laporkan Sekarang
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
